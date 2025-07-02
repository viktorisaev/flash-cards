import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { cardsTable } from "@/db/schema";
import type { CreateCardInput, UpdateCardInput, QueryResult, Card } from "./types";

/**
 * Get all cards for a specific deck
 */
export async function getCardsByDeckId(deckId: number): Promise<QueryResult<Card[]>> {
  try {
    const cards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.deckId, deckId));
    
    return { data: cards, error: null };
  } catch (error) {
    console.error("Failed to get cards:", error);
    return { data: null, error: "Failed to get cards" };
  }
}

/**
 * Get a specific card by ID
 */
export async function getCardById(id: number): Promise<QueryResult<Card>> {
  try {
    const [card] = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.id, id));
    
    if (!card) {
      return { data: null, error: "Card not found" };
    }
    
    return { data: card, error: null };
  } catch (error) {
    console.error("Failed to get card:", error);
    return { data: null, error: "Failed to get card" };
  }
}

/**
 * Create a new card
 */
export async function createCard(data: CreateCardInput): Promise<QueryResult<Card>> {
  try {
    const [card] = await db
      .insert(cardsTable)
      .values(data)
      .returning();
    
    return { data: card, error: null };
  } catch (error) {
    console.error("Failed to create card:", error);
    return { data: null, error: "Failed to create card" };
  }
}

/**
 * Update an existing card
 */
export async function updateCard({ id, ...data }: UpdateCardInput): Promise<QueryResult<Card>> {
  try {
    const [card] = await db
      .update(cardsTable)
      .set(data)
      .where(eq(cardsTable.id, id))
      .returning();
    
    if (!card) {
      return { data: null, error: "Card not found" };
    }
    
    return { data: card, error: null };
  } catch (error) {
    console.error("Failed to update card:", error);
    return { data: null, error: "Failed to update card" };
  }
}

/**
 * Delete a card
 */
export async function deleteCard(id: number): Promise<QueryResult<Card>> {
  try {
    const [card] = await db
      .delete(cardsTable)
      .where(eq(cardsTable.id, id))
      .returning();
    
    if (!card) {
      return { data: null, error: "Card not found" };
    }
    
    return { data: card, error: null };
  } catch (error) {
    console.error("Failed to delete card:", error);
    return { data: null, error: "Failed to delete card" };
  }
} 