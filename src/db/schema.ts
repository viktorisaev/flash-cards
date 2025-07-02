import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const decksTable = pgTable("decks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull(), // Clerk user ID
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cardsTable = pgTable("cards", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  deckId: integer("deck_id").references(() => decksTable.id, { onDelete: "cascade" }).notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 