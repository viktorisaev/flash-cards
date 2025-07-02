import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DeckCard } from "@/components/DeckCard";
import { getDecksWithCardCounts } from "@/db/queries";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Enforce authentication
  if (!userId) {
    redirect("/");
  }

  // Fetch decks with card counts
  const { data: decksWithCounts, error } = await getDecksWithCardCounts(userId);

  if (error) {
    // TODO: Add proper error handling
    throw new Error(error);
  }

  return (
    <div className={cn("mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl")}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>Dashboard</h1>
            <p className={cn("text-muted-foreground")}>Manage your flashcard decks and study progress</p>
          </div>
          <Button asChild>
            <Link href="/decks/new">Create New Deck</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!decksWithCounts || decksWithCounts.length === 0 ? (
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
                cardCount={deck.cardCount}
                updatedAt={deck.updatedAt}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 