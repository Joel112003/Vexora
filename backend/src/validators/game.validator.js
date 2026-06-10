import { z } from 'zod';

const betAmount = z.number().min(1).max(100_000);

export const diceSchema = z.object({
  betAmount,
  target:     z.number().min(2).max(98),
  direction:  z.enum(['over', 'under']),
});

export const coinflipSchema = z.object({
  betAmount,
  choice: z.enum(['heads', 'tails']),
});

export const minesStartSchema = z.object({
  betAmount,
  mineCount: z.number().int().min(1).max(24),
});

export const minesRevealSchema = z.object({
  index: z.number().int().min(0).max(24),
});

export const crashBetSchema = z.object({
  betAmount,
  autoCashout: z.number().min(1.01).optional(),
});