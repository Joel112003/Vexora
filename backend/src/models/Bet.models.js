import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    gameType: {
      type: String,
      enum: ['dice', 'crash', 'mines', 'coinflip'],
      required: true,
    },
    betAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    multiplier: {
      type: Number,
      default: 0,
    },
    payout: {
      type: Number,
      default: 0,
    },
    outcome: {
      type: String,
      enum: ['win', 'loss', 'pending'],
      default: 'pending',
    },
    gameData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

betSchema.index({ userId: 1, createdAt: -1 });
betSchema.index({ gameType: 1, createdAt: -1 });
betSchema.index({ outcome: 1 });

const Bet = mongoose.model('Bet', betSchema);
export default Bet;