import { createFileRoute } from "@tanstack/react-router";
import { HeroList } from "@/components/HeroList";

export const Route = createFileRoute("/dc")({
  head: () => ({ meta: [{ title: "DC — Superhéroes SPA" }] }),
  component: () => (
    <HeroList casa="dc" title="DC" subtitle="Solo personajes de DC" />
  ),
});
