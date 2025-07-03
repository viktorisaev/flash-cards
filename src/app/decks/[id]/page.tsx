import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDeckById } from "@/db/queries/decks";
import { getCardsByDeckId } from "@/db/queries/cards";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileEdit } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DeckPage({ params }: PageProps) {
  const authResult = await auth();
  const userId = authResult.userId;
  if (!userId) {
    redirect("/");
  }

  const deckId = parseInt(params.id);
  if (isNaN(deckId)) {
    redirect("/dashboard");
  }

  const { data: deck, error: deckError } = await getDeckById(deckId, userId);
  if (deckError || !deck) {
    redirect("/dashboard");
  }

  const { data: cards, error: cardsError } = await getCardsByDeckId(deckId);
  if (cardsError) {
    redirect("/dashboard");
  }

  const cardsList = cards || [];

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{deck.title}</h1>
          {deck.description && (
            <p className="text-muted-foreground mt-2">{deck.description}</p>
          )}
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link href={`/decks/${deck.id}/study`}>Study Deck</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/decks/${deck.id}/edit`}>Edit Deck</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cards ({cardsList.length})</CardTitle>
            <CardDescription>All flashcards in this deck</CardDescription>
          </CardHeader>
          <CardContent>
            {cardsList.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No cards yet</p>
                <Button className="mt-4" asChild>
                  <Link href={`/decks/${deck.id}/cards/new`}>Add Your First Card</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardsList.map((card, index) => (
                  <Card key={card.id} className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Card #{index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Front</h3>
                          <p className="text-sm text-muted-foreground">{card.front}</p>
                        </div>
                        <div>
                          <h3 className="font-medium mb-2">Back</h3>
                          <p className="text-sm text-muted-foreground">{card.back}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-3">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/decks/${deck.id}/cards/${card.id}/edit`} className="flex items-center gap-2">
                          <FileEdit className="h-4 w-4" />
                          <span>Edit Card</span>
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 