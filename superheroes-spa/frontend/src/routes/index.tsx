import { createFileRoute } from "@tanstack/react-router";
import { HeroList } from "@/components/HeroList";

export const Route = createFileRoute("/")({
  component: () => (
    <HeroList
      title="Todos los superhéroes"
      subtitle="Marvel + DC · héroes y villanos"
    />
  ),
});
