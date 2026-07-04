import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled', 'Expired'],
      default: 'Active',
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    checkedOutAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

reservationSchema.index({ userId: 1, status: 1 });
reservationSchema.index({ seatId: 1, status: 1 });
reservationSchema.index({ endTime: 1, status: 1 });

export const Reservation = mongoose.model('Reservation', reservationSchema);
