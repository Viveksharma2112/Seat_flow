import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floor',
      required: true,
    },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Occupied'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

seatSchema.index({ floor: 1, section: 1, seatNumber: 1 }, { unique: true });

export const Seat = mongoose.model('Seat', seatSchema);
