import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['dice', 'crash', 'mines', 'coinflip'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    config: {
      type: mongoose.Schema.Types.Mixed, 
      default: {},
    },
  },
  { timestamps: true }
);

const Game = mongoose.model('Game', gameSchema);
export default Game;