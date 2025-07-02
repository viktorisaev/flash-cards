import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DeckCard } from "@/components/DeckCard";
import { db, decksTable, cardsTable } from "@/db";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <div className={cn("mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl")}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>Dashboard</h1>
          <Button asChild>
            <Link href="/decks/new">Create New Deck</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decksWithCounts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Decks Yet</CardTitle>
                <CardDescription>
                  Create your first flashcard deck to get started!
                </CardDescription>
              </CardHeader>
            </Card>
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
    </div>
  );
} 