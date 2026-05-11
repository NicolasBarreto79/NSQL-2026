import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/heroes/$id")({
  component: HeroDetail,
});

function HouseLogo({ casa }: { casa: "marvel" | "dc" }) {
  if (casa === "marvel") {
    return (
      <div className="inline-flex items-center justify-center bg-marvel text-marvel-foreground font-black text-xl px-4 py-2 rounded-md tracking-widest">
        MARVEL
      </div>
    );
  }
  return (
    <div className="inline-flex items-center justify-center bg-dc text-dc-foreground font-black text-xl px-5 py-2 rounded-full tracking-widest border-2 border-dc-foreground/30">
      DC
    </div>
  );
}

function HeroDetail() {
  const { id } = useParams({ from: "/heroes/$id" });
  const { data: hero, isLoading, isError, error } = useQuery({
    queryKey: ["superhero", id],
    queryFn: () => api.get(id),
  });

  if (isLoading) return <p className="container mx-auto p-8">Cargando…</p>;
  if (isError || !hero)
    return (
      <div className="container mx-auto p-8">
        <p className="text-destructive mb-4">
          No se pudo cargar: {(error as Error)?.message}
        </p>
        <Button asChild variant="outline">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Volver</Link>
        </Button>
      </div>
    );

  const hasMultiple = hero.imagenes.length > 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Volver</Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {hasMultiple ? (
            <Carousel className="w-full">
              <CarouselContent>
                {hero.imagenes.map((src, i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                      <img
                        src={src}
                        alt={`${hero.nombre} ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-muted">
              <img
                src={hero.imagenes[0]}
                alt={hero.nombre}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <HouseLogo casa={hero.casa} />
            {hero.tipo && (
              <Badge variant="outline" className="capitalize">
                {hero.tipo}
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {hero.nombre}
            </h1>
            {hero.nombreReal && (
              <p className="text-lg text-muted-foreground italic mt-1">
                {hero.nombreReal}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Aparición: {hero.anioAparicion}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> {hero.imagenes.length} imagen
              {hero.imagenes.length !== 1 && "es"}
            </span>
          </div>

          <Card className="p-4">
            <h2 className="font-semibold mb-2">Biografía</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {hero.biografia}
            </p>
          </Card>

          {hero.equipamiento && hero.equipamiento.length > 0 && (
            <Card className="p-4">
              <h2 className="font-semibold mb-2">Equipamiento</h2>
              <div className="flex flex-wrap gap-2">
                {hero.equipamiento.map((e) => (
                  <Badge key={e} variant="secondary">{e}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
