import { createFileRoute } from "@tanstack/react-router";
import { Hangman } from "@/components/craft/Hangman";

export const Route = createFileRoute("/hangman")({
  component: HangmanPage,
});

function HangmanPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#090e15]">
      <h1 className="sr-only">Hangman</h1>
      <Hangman />
    </main>
  );
}
