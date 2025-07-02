import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default async function Home() {
  // Check if user is authenticated
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <Card className="mx-auto max-w-lg mt-20">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl">Flashy Cardy</CardTitle>
        <CardDescription className="text-xl">Your personal flashcard platform</CardDescription>
      </CardHeader>
      
      <CardContent className="flex justify-center gap-4">
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Sign Up</Button>
        </SignUpButton>
      </CardContent>
    </Card>
  );
}
