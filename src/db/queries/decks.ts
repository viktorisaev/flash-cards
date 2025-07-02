import { eq, and, count } from "drizzle-orm";
import { db } from "@/db";
import { decksTable, cardsTable } from "@/db/schema";
import type { CreateDeckInput, UpdateDeckInput, QueryResult, Deck } from "./types";

/**
 * Get all decks for a specific user
 */
export async function getDecksByUserId(userId: string): Promise<QueryResult<Deck[]>> {
  try {
    const decks = await db
      .select()
      .from(decksTable)
      .where(eq(decksTable.userId, userId));
    
    return { data: decks, error: null };
  } catch (error) {
    console.error("Failed to get decks:", error);
    return { data: null, error: "Failed to get decks" };
  }
}

/**
 * Get a specific deck by ID (ensures user owns the deck)
 */
export async function getDeckById(id: number, userId: string): Promise<QueryResult<Deck>> {
  try {
    const [deck] = await db
      .select()
      .from(decksTable)
      .where(
        and(
          eq(decksTable.id, id),
          eq(decksTable.userId, userId)
        )
      );
    
    if (!deck) {
      return { data: null, error: "Deck not found" };
    }
    
    return { data: deck, error: null };
  } catch (error) {
    console.error("Failed to get deck:", error);
    return { data: null, error: "Failed to get deck" };
  }
}

/**
 * Create a new deck
 */
export async function createDeck(data: CreateDeckInput): Promise<QueryResult<Deck>> {
  try {
    const [deck] = await db
      .insert(decksTable)
      .values(data)
      .returning();
    
    return { data: deck, error: null };
  } catch (error) {
    console.error("Failed to create deck:", error);
    return { data: null, error: "Failed to create deck" };
  }
}

/**
 * Update an existing deck (ensures user owns the deck)
 */
export async function updateDeck({ id, userId, ...data }: UpdateDeckInput): Promise<QueryResult<Deck>> {
  try {
    const [deck] = await db
      .update(decksTable)
      .set(data)
      .where(
        and(
          eq(decksTable.id, id),
          eq(decksTable.userId, userId)
        )
      )
      .returning();
    
    if (!deck) {
      return { data: null, error: "Deck not found" };
    }
    
    return { data: deck, error: null };
  } catch (error) {
    console.error("Failed to update deck:", error);
    return { data: null, error: "Failed to update deck" };
  }
}

/**
 * Delete a deck (ensures user owns the deck)
 */
export async function deleteDeck(id: number, userId: string): Promise<QueryResult<Deck>> {
  try {
    const [deck] = await db
      .delete(decksTable)
      .where(
        and(
          eq(decksTable.id, id),
          eq(decksTable.userId, userId)
        )
      )
      .returning();
    
    if (!deck) {
      return { data: null, error: "Deck not found" };
    }
    
    return { data: deck, error: null };
  } catch (error) {
    console.error("Failed to delete deck:", error);
    return { data: null, error: "Failed to delete deck" };
  }
}

/**
 * Get all decks for a user with card counts
 */
export interface DeckWithCardCount extends Deck {
  cardCount: number;
}

export async function getDecksWithCardCounts(userId: string): Promise<QueryResult<DeckWithCardCount[]>> {
  try {
    const decks = await db
      .select({
        id: decksTable.id,
        userId: decksTable.userId,
        title: decksTable.title,
        description: decksTable.description,
        createdAt: decksTable.createdAt,
        updatedAt: decksTable.updatedAt,
        cardCount: count(cardsTable.id).as('cardCount'),
      })
      .from(decksTable)
      .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
      .where(eq(decksTable.userId, userId))
      .groupBy(decksTable.id)
      .orderBy(decksTable.updatedAt);
    
    return { data: decks.map(deck => ({ ...deck, cardCount: Number(deck.cardCount) })), error: null };
  } catch (error) {
    console.error("Failed to get decks with card counts:", error);
    return { data: null, error: "Failed to get decks" };
  }
} 