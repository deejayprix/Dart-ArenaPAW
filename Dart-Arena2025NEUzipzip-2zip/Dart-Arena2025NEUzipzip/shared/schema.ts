import { z } from "zod";

// Player type for the game
export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  score: z.number(),
  throws: z.array(z.number()),
  currentThrowScores: z.array(z.number()),
  legs: z.number(),
  sets: z.number(),
  totalThrows: z.number(),
  totalScore: z.number(),
  hasStarted: z.boolean(),
});

export type Player = z.infer<typeof playerSchema>;

// Game configuration
export const gameConfigSchema = z.object({
  gameMode: z.enum(["501", "301", "701", "around_the_clock"]),
  startingScore: z.enum(["301", "501", "701"]),
  numberOfLegs: z.number().min(1),
  numberOfSets: z.number().min(1),
  inMode: z.enum(["standard", "double", "master"]),
  outMode: z.enum(["standard", "double", "master"]),
});

export type GameConfig = z.infer<typeof gameConfigSchema>;

// Game state
export const gameStateSchema = z.object({
  isStarted: z.boolean(),
  currentPlayerIndex: z.number(),
  currentDartIndex: z.number(),
  isDoubleMode: z.boolean(),
  isTripleMode: z.boolean(),
  players: z.array(playerSchema),
  config: gameConfigSchema,
  throwHistory: z.array(z.object({
    playerId: z.string(),
    playerName: z.string(),
    scores: z.array(z.number()),
    total: z.number(),
  })),
});

export type GameState = z.infer<typeof gameStateSchema>;
