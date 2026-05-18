import { z } from 'zod';

export const diceSchema = z.object({
  betAmount:  z.number().min(1).max(1000),
  target:     z.number().min(2).max(98),
  direction:  z.enum(['over', 'under']),
});

export const coinflipSchema = z.object({
  betAmount: z.number().min(1).max(1000),
  choice:    z.enum(['heads', 'tails']),
});

export const minesStartSchema = z.object({
  betAmount:  z.number().min(1).max(1000),
  mineCount:  z.number().min(1).max(24),
});

export const minesRevealSchema = z.object({
  index: z.number().min(0).max(24),
});

export const crashBetSchema = z.object({
  betAmount:   z.number().min(1).max(1000),
  autoCashout: z.number().min(1.01).max(100).optional(),
});