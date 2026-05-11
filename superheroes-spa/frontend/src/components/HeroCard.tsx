import { Link } from "@tanstack/react-router";
import type { Superhero } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  hero: Superhero;
  onEdit: (h: Superhero) => void;
  onDelete: (h: Superhero) => void;
}

export function HeroCard({ hero, onEdit, onDelete }: Props) {
  const truncated =
    hero.biografia.length > 140
      ? hero.biografia.slice(0, 140).trimEnd() + "…"
      : hero.biografia;

  return (
    <Card className="overflow-hidden flex flex-col bg-card border-border hover:border-primary/50 transition-colors">
      <Link
        to="/heroes/$id"
        params={{ id: hero._id }}
        className="block aspect-[3/4] overflow-hidden bg-muted"
      >
        <img
          src={hero.imagenes[0]}
          alt={hero.nombre}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link to="/heroes/$id" params={{ id: hero._id }}>
            <h3 className="font-bold text-lg leading-tight hover:text-primary transition-colors">
              {hero.nombre}
            </h3>
          </Link>
          <Badge
            className={
              hero.casa === "marvel"
                ? "bg-marvel text-marvel-foreground"
                : "bg-dc text-dc-foreground"
            }
          >
            {hero.casa.toUpperCase()}
          </Badge>
        </div>
        {hero.nombreReal && (
          <p className="text-xs text-muted-foreground italic">{hero.nombreReal}</p>
        )}
        <p className="text-sm text-muted-foreground flex-1">{truncated}</p>
        <div className="flex gap-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(hero)}
          >
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onDelete(hero)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
}
