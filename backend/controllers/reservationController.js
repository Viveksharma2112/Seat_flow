import * as reservationService from '../services/reservationService.js';
import * as queueService from '../services/queueService.js';

export const createReservation = async (req, res) => {
  const result = await reservationService.createReservation({
    userId: req.user.id,
    ...req.body,
  });
  res.status(result.queued ? 202 : 201).json({ success: true, ...result });
};

export const cancelReservation = async (req, res) => {
  const reservation = await reservationService.cancelReservation(
    req.user.id,
    req.params.id,
    req.user.role === 'Admin'
  );
  res.json({ success: true, reservation });
};

export const checkIn = async (req, res) => {
  const reservation = await reservationService.checkIn(req.user.id, req.params.id);
  res.json({ success: true, reservation });
};

export const checkOut = async (req, res) => {
  const reservation = await reservationService.checkOut(req.user.id, req.params.id);
  res.json({ success: true, reservation });
};

export const getCurrentBooking = async (req, res) => {
  const booking = await reservationService.getCurrentBooking(req.user.id);
  res.json({ success: true, booking });
};

export const getMyReservations = async (req, res) => {
  const result = await reservationService.getUserReservations(req.user.id, req.query);
  res.json({ success: true, ...result });
};

export const getAllReservations = async (req, res) => {
  const result = await reservationService.getAllReservations(req.query);
  res.json({ success: true, ...result });
};

export const getMyQueue = async (req, res) => {
  const entries = await queueService.getUserQueueEntries(req.user.id);
  res.json({ success: true, data: entries });
};

export const cancelQueue = async (req, res) => {
  const entry = await queueService.cancelQueueEntry(req.user.id, req.params.id);
  res.json({ success: true, entry });
};
