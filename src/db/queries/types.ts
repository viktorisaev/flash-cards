import type { InferModel } from "drizzle-orm";
import type { decksTable, cardsTable } from "@/db/schema";

// Inferred types from schema
export type Deck = InferModel<typeof decksTable>;
export type NewDeck = InferModel<typeof decksTable, "insert">;
export type Card = InferModel<typeof cardsTable>;
export type NewCard = InferModel<typeof cardsTable, "insert">;

// Input types for mutations
export interface CreateDeckInput {
  userId: string;
  title: string;
  description?: string | null;
}

export interface UpdateDeckInput extends Partial<Omit<CreateDeckInput, "userId">> {
  id: number;
  userId: string;
}

export interface CreateCardInput {
  deckId: number;
  front: string;
  back: string;
}

export interface UpdateCardInput extends Partial<Omit<CreateCardInput, "deckId">> {
  id: number;
  deckId: number;
}

// Return types for query functions
export interface QueryResult<T> {
  data: T | null;
  error: string | null;
} 