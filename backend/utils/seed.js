import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Floor } from '../models/Floor.js';
import { Section } from '../models/Section.js';
import { Seat } from '../models/Seat.js';
import { Reservation } from '../models/Reservation.js';
import { WaitQueue } from '../models/WaitQueue.js';

dotenv.config();

const firstNames = [
  'Aarav', 'Aanya', 'Aditya', 'Akshay', 'Anika', 'Arjun', 'Diya', 'Ishaan', 'Kiara', 'Meera',
  'Neha', 'Nikhil', 'Rohan', 'Saanvi', 'Sara', 'Vihaan', 'Yash', 'Zoya', 'Kabir', 'Priya',
  'Riya', 'Tanya', 'Karan', 'Maya', 'Naina', 'Om', 'Parth', 'Shreya', 'Tushar', 'Varun',
];

const lastNames = [
  'Patel', 'Sharma', 'Iyer', 'Gupta', 'Nair', 'Khan', 'Mehta', 'Joshi', 'Reddy', 'Singh',
  'Kapoor', 'Bose', 'Malhotra', 'Chopra', 'Pillai', 'Saxena', 'Kaur', 'Verma', 'Jain', 'Rao',
];

const floorDefinitions = [
  { name: 'Floor 1', description: 'Quiet reading and deep work spaces' },
  { name: 'Floor 2', description: 'Collaboration and team study zones' },
  { name: 'Floor 3', description: 'Project rooms and focused booking areas' },
  { name: 'Floor 4', description: 'Premium study and lounge spaces' },
];

const sectionDefinitions = [
  ['Quiet Zone', 'Reading Nook'],
  ['Collaboration Hub', 'Team Pods'],
  ['Focus Hall', 'Project Studio'],
  ['Terrace Study', 'Premium Lounge'],
];

const reservationStatusPlan = [
  ...Array.from({ length: 100 }, () => 'Active'),
  ...Array.from({ length: 80 }, () => 'Completed'),
  ...Array.from({ length: 40 }, () => 'Cancelled'),
  ...Array.from({ length: 30 }, () => 'Expired'),
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const createTimestamp = (baseDate, spreadMinutes = 240) => {
  const date = new Date(baseDate);
  const offset = randomInt(-spreadMinutes, spreadMinutes) * 60000;
  return new Date(date.getTime() + offset);
};

const buildDatedTime = (daysAgo, hour, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const timeSlots = {
  morning: [8, 9, 10],
  afternoon: [12, 13, 14, 15],
  evening: [17, 18, 19, 20],
};

const pickSlot = (type) => {
  const slots = timeSlots[type] || timeSlots.afternoon;
  return slots[randomInt(0, slots.length - 1)];
};

const buildStudentName = (index) => {
  const first = firstNames[index % firstNames.length];
  const last = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  return `${first} ${last}`;
};

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected for seeding');

  await Promise.all([
    User.deleteMany({}),
    Floor.deleteMany({}),
    Section.deleteMany({}),
    Seat.deleteMany({}),
    Reservation.deleteMany({}),
    WaitQueue.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'SeatFlow Admin',
    email: 'admin@seatflow.com',
    password: 'Admin@123',
    role: 'Admin',
  });

  const students = await User.insertMany(
    Array.from({ length: 500 }).map((_, index) => ({
      name: buildStudentName(index),
      email: `student${String(index + 1).padStart(3, '0')}@seatflow.com`,
      password: 'Student@123',
      role: 'Student',
    }))
  );

  const floors = await Floor.insertMany(floorDefinitions);
  const sections = [];

  for (let index = 0; index < floors.length; index += 1) {
    const [leftSection, rightSection] = sectionDefinitions[index];
    const createdSections = await Section.insertMany([
      {
        name: leftSection,
        floor: floors[index]._id,
        description: `${leftSection} on ${floors[index].name}`,
      },
      {
        name: rightSection,
        floor: floors[index]._id,
        description: `${rightSection} on ${floors[index].name}`,
      },
    ]);
    sections.push(...createdSections);
  }

  const seatBlueprints = [];
  for (let floorIndex = 0; floorIndex < floors.length; floorIndex += 1) {
    const floor = floors[floorIndex];
    const floorSections = sections.filter((section) => String(section.floor) === String(floor._id));

    for (let seatIndex = 1; seatIndex <= 50; seatIndex += 1) {
      const section = seatIndex <= 25 ? floorSections[0] : floorSections[1];
      const rowLabel = String.fromCharCode(64 + ((seatIndex - 1) % 5) + 1);
      seatBlueprints.push({
        seatNumber: `F${floorIndex + 1}-${rowLabel}${String(seatIndex).padStart(2, '0')}`,
        floor: floor._id,
        section: section._id,
      });
    }
  }

  const shuffledSeats = shuffle(seatBlueprints);
  const occupiedSeatIds = new Set(shuffledSeats.slice(0, 60).map((seat) => String(seat.seatNumber)));
  const reservedSeatIds = new Set(shuffledSeats.slice(60, 100).map((seat) => String(seat.seatNumber)));

  const seats = await Seat.insertMany(
    shuffledSeats.map((seat) => ({
      ...seat,
      status: occupiedSeatIds.has(seat.seatNumber)
        ? 'Occupied'
        : reservedSeatIds.has(seat.seatNumber)
          ? 'Reserved'
          : 'Available',
    }))
  );

  const now = new Date();
  const reservationDocs = [];
  const currentActiveSeats = seats.slice(0, 100);

  currentActiveSeats.forEach((seat, index) => {
    const isOccupied = index < 60;
    const slotType = index % 3 === 0 ? 'morning' : index % 3 === 1 ? 'afternoon' : 'evening';
    const dayOffset = randomInt(0, 5);
    const startHour = isOccupied ? pickSlot(slotType) : pickSlot('afternoon');
    const startTime = isOccupied
      ? buildDatedTime(dayOffset, startHour, randomInt(0, 45))
      : new Date(now.getTime() + randomInt(15, 240) * 60000);
    const endTime = new Date(startTime.getTime() + randomInt(2, 4) * 60 * 60000);
    reservationDocs.push({
      userId: students[index]._id,
      seatId: seat._id,
      startTime,
      endTime,
      status: 'Active',
      checkedInAt: isOccupied ? new Date(startTime.getTime() + 10 * 60000) : null,
      checkedOutAt: null,
      createdAt: isOccupied
        ? createTimestamp(new Date(startTime.getTime() - randomInt(30, 120) * 60000), 5)
        : new Date(now.getTime() - randomInt(5, 120) * 60000),
      updatedAt: isOccupied
        ? createTimestamp(new Date(startTime.getTime() - randomInt(20, 60) * 60000), 5)
        : new Date(now.getTime() - randomInt(1, 30) * 60000),
    });
  });

  const historicalSeats = shuffle(seats);
  reservationStatusPlan.slice(100).forEach((status, index) => {
    const seat = historicalSeats[index % historicalSeats.length];
    const user = students[(index + 120) % students.length];
    const daysAgo = randomInt(1, 30);
    const slotType = index % 3 === 0 ? 'morning' : index % 3 === 1 ? 'afternoon' : 'evening';
    const startTime = buildDatedTime(daysAgo, pickSlot(slotType), randomInt(0, 45));
    const durationHours = randomInt(1, 4);
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    const createdAt = createTimestamp(new Date(startTime.getTime() - randomInt(30, 180) * 60000), 10);
    const checkedInAt = status === 'Completed' ? new Date(startTime.getTime() + randomInt(10, 25) * 60000) : null;
    const checkedOutAt = status === 'Completed'
      ? new Date(Math.min(endTime.getTime() - 15 * 60000, checkedInAt.getTime() + randomInt(45, 150) * 60000))
      : null;

    reservationDocs.push({
      userId: user._id,
      seatId: seat._id,
      startTime,
      endTime,
      status,
      checkedInAt,
      checkedOutAt,
      createdAt,
      updatedAt: new Date(Math.min(now.getTime(), endTime.getTime() + randomInt(15, 240) * 60000)),
    });
  });

  await Reservation.insertMany(reservationDocs, { ordered: false });

  console.log('Seed complete');
  console.log('Admin:', admin.email, '/ Admin@123');
  console.log('Students:', students.length);
  console.log('Floors:', floors.length);
  console.log('Sections:', sections.length);
  console.log('Seats:', seats.length);
  console.log('Reservations:', reservationDocs.length);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
