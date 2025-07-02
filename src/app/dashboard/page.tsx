import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DeckCard } from "@/components/DeckCard";
import { db, decksTable, cardsTable } from "@/db";
import { eq, count } from "drizzle-orm";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Enforce authentication
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch decks with card counts
  const decksWithCounts = await db
    .select({
      id: decksTable.id,
      title: decksTable.title,
      description: decksTable.description,
      updatedAt: decksTable.updatedAt,
      cardCount: count(cardsTable.id).as('cardCount'),
    })
    .from(decksTable)
    .leftJoin(cardsTable, eq(decksTable.id, cardsTable.deckId))
    .where(eq(decksTable.userId, userId))
    .groupBy(decksTable.id, decksTable.title, decksTable.description, decksTable.updatedAt)
    .orderBy(decksTable.updatedAt);

  return (
    <main className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link href="/decks/new">Create New Deck</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decksWithCounts.length === 0 ? (
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">No Decks Yet</h2>
              <p className="text-muted-foreground">
                Create your first flashcard deck to get started!
              </p>
            </div>
          ) : (
            decksWithCounts.map((deck) => (
              <DeckCard
                key={deck.id}
                id={deck.id}
                title={deck.title}
                description={deck.description}
                cardCount={Number(deck.cardCount)}
                updatedAt={deck.updatedAt}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
} 