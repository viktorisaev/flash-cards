import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // Check if user is authenticated
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Flashy Cardy</h1>
        <p className="text-xl text-muted-foreground">Your personal flashcard platform</p>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
        <Button asChild>
          <a href="/sign-up">Sign Up</a>
        </Button>
      </div>
    </div>
  );
}
