import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Casa, Superhero, SuperheroInput } from "@/lib/types";
import { HeroCard } from "./HeroCard";
import { HeroFormDialog } from "./HeroFormDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  casa?: Casa;
  title: string;
  subtitle: string;
}

export function HeroList({ casa, title, subtitle }: Props) {
  const qc = useQueryClient();
  const queryKey = ["superheroes", casa ?? "all"] as const;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => api.list(casa),
    retry: 1,
  });

  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Superhero | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Superhero | null>(null);

  useEffect(() => setFilter(""), [casa]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (h) =>
        h.nombre.toLowerCase().includes(q) ||
        (h.nombreReal ?? "").toLowerCase().includes(q),
    );
  }, [data, filter]);

  async function handleSave(input: SuperheroInput) {
    try {
      if (editing) {
        await api.update(editing._id, input);
        toast.success("Superhéroe actualizado");
      } else {
        await api.create(input);
        toast.success("Superhéroe creado");
      }
      qc.invalidateQueries({ queryKey: ["superheroes"] });
    } catch (e) {
      toast.error(`Error al guardar: ${(e as Error).message}`);
      throw e;
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await api.remove(deleting._id);
      toast.success(`${deleting.nombre} eliminado`);
      qc.invalidateQueries({ queryKey: ["superheroes"] });
    } catch (e) {
      toast.error(`Error al eliminar: ${(e as Error).message}`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar por nombre…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => { setEditing(null); setCreating(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Cargando…</p>}

      {isError && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive-foreground rounded-lg p-4 mb-6">
          <p className="font-semibold">No se pudo conectar con la API.</p>
          <p className="text-sm mt-1 opacity-80">{(error as Error).message}</p>
          <p className="text-sm mt-2">
            Asegurate de levantar el backend con <code>docker compose up -d --build</code> y
            cargar datos con <code>docker compose --profile seed run --rm seed</code>.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {data && filtered.length === 0 && !isLoading && (
        <p className="text-muted-foreground">Sin resultados.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((h) => (
          <HeroCard
            key={h._id}
            hero={h}
            onEdit={(hero) => { setEditing(hero); setCreating(true); }}
            onDelete={(hero) => setDeleting(hero)}
          />
        ))}
      </div>

      <HeroFormDialog
        open={creating}
        onOpenChange={setCreating}
        initial={editing}
        onSubmit={handleSave}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {deleting?.nombre}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
