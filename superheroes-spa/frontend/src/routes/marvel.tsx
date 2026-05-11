import { createFileRoute } from "@tanstack/react-router";
import { HeroList } from "@/components/HeroList";

export const Route = createFileRoute("/marvel")({
  head: () => ({ meta: [{ title: "Marvel — Superhéroes SPA" }] }),
  component: () => (
    <HeroList casa="marvel" title="Marvel" subtitle="Solo personajes de Marvel" />
  ),
});
