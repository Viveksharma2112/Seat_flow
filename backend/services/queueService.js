import mongoose from 'mongoose';
import { WaitQueue } from '../models/WaitQueue.js';
import { ApiError } from '../utils/ApiError.js';

export const getNextQueuePosition = async (seatId, session) => {
  const last = await WaitQueue.findOne({ seatId, status: 'Waiting' })
    .sort({ position: -1 })
    .session(session)
    .lean();
  return (last?.position || 0) + 1;
};

export const joinWaitQueue = async ({ userId, seatId, startTime, endTime }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await WaitQueue.findOne({
      userId,
      seatId,
      status: 'Waiting',
    }).session(session);

    if (existing) {
      throw new ApiError(409, 'You are already in the queue for this seat');
    }

    const position = await getNextQueuePosition(seatId, session);
    const [entry] = await WaitQueue.create(
      [{ userId, seatId, startTime, endTime, position }],
      { session }
    );

    await session.commitTransaction();
    return entry;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const cancelQueueEntry = async (userId, queueId) => {
  const entry = await WaitQueue.findOne({ _id: queueId, userId, status: 'Waiting' });
  if (!entry) throw new ApiError(404, 'Queue entry not found');

  entry.status = 'Cancelled';
  await entry.save();
  return entry;
};

export const getUserQueueEntries = async (userId) => {
  return WaitQueue.find({ userId, status: 'Waiting' })
    .populate({
      path: 'seatId',
      populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
    })
    .sort({ createdAt: 1 });
};

export const processNextInQueue = async (seatId, session) => {
  const next = await WaitQueue.findOne({ seatId, status: 'Waiting' })
    .sort({ position: 1 })
    .session(session);

  if (!next) return null;

  next.status = 'Fulfilled';
  await next.save({ session });
  return next;
};
