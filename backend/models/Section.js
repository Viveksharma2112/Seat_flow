import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Floor',
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

sectionSchema.index({ floor: 1, name: 1 }, { unique: true });

export const Section = mongoose.model('Section', sectionSchema);
