import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      default: 'info',
    },
    action: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    capped: { size: 10_000_000, max: 50_000 },
  }
);

logSchema.index({ level: 1, createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });

const Log = mongoose.model('Log', logSchema);
export default Log;