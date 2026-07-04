import * as seatService from '../services/seatService.js';

export const createSeat = async (req, res) => {
  const seat = await seatService.createSeat(req.body);
  res.status(201).json({ success: true, seat });
};

export const getSeats = async (req, res) => {
  const result = await seatService.getSeats(req.query);
  res.json({ success: true, ...result });
};

export const getSeat = async (req, res) => {
  const seat = await seatService.getSeatById(req.params.id);
  res.json({ success: true, seat });
};

export const updateSeat = async (req, res) => {
  const seat = await seatService.updateSeat(req.params.id, req.body);
  res.json({ success: true, seat });
};

export const deleteSeat = async (req, res) => {
  await seatService.deleteSeat(req.params.id);
  res.json({ success: true, message: 'Seat deleted' });
};
