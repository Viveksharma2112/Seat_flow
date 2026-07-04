import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Waiting', 'Fulfilled', 'Cancelled'],
      default: 'Waiting',
    },
  },
  { timestamps: true }
);

queueSchema.index({ seatId: 1, status: 1, position: 1 });

export const WaitQueue = mongoose.model('WaitQueue', queueSchema);
