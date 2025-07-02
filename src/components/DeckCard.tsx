import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface DeckCardProps {
  id: number;
  title: string;
  description: string | null;
  cardCount?: number;
  updatedAt: Date;
}

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

function formatFullDate(date: Date) {
  const dateStr = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateStr} at ${timeStr}`;
}

export function DeckCard({ id, title, description, cardCount = 0, updatedAt }: DeckCardProps) {
  return (
    <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          {description && (
            <p className="text-muted-foreground mb-4">{description}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <p>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</p>
            <span>•</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="cursor-help">Updated {formatDate(updatedAt)}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Updated on {formatFullDate(updatedAt)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button asChild className="flex-1">
            <Link href={`/decks/${id}`}>View Deck</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href={`/decks/${id}/study`}>Study</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 