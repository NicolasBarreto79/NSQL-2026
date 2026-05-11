import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Superhero, SuperheroInput } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Superhero | null;
  onSubmit: (data: SuperheroInput) => Promise<void>;
}

const empty: SuperheroInput = {
  nombre: "",
  nombreReal: "",
  anioAparicion: new Date().getFullYear(),
  casa: "marvel",
  tipo: "heroe",
  biografia: "",
  equipamiento: [],
  imagenes: [],
};

export function HeroFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
  const [form, setForm] = useState<SuperheroInput>(empty);
  const [imagesText, setImagesText] = useState("");
  const [equipText, setEquipText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      const { _id, ...rest } = initial;
      void _id;
      setForm(rest);
      setImagesText(initial.imagenes.join("\n"));
      setEquipText((initial.equipamiento ?? []).join(", "));
    } else {
      setForm(empty);
      setImagesText("");
      setEquipText("");
    }
  }, [initial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const imagenes = imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const equipamiento = equipText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await onSubmit({ ...form, imagenes, equipamiento });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar" : "Nuevo"} superhéroe</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nombreReal">Nombre real</Label>
              <Input
                id="nombreReal"
                value={form.nombreReal ?? ""}
                onChange={(e) => setForm({ ...form, nombreReal: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="anio">Año de aparición *</Label>
              <Input
                id="anio"
                type="number"
                required
                value={form.anioAparicion}
                onChange={(e) =>
                  setForm({ ...form, anioAparicion: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Casa *</Label>
              <Select
                value={form.casa}
                onValueChange={(v) => setForm({ ...form, casa: v as "marvel" | "dc" })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="marvel">Marvel</SelectItem>
                  <SelectItem value="dc">DC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                value={form.tipo ?? "heroe"}
                onValueChange={(v) => setForm({ ...form, tipo: v as "heroe" | "villano" })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="heroe">Héroe</SelectItem>
                  <SelectItem value="villano">Villano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Biografía *</Label>
            <Textarea
              id="bio"
              required
              rows={3}
              value={form.biografia}
              onChange={(e) => setForm({ ...form, biografia: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="equip">Equipamiento (separado por comas)</Label>
            <Input
              id="equip"
              value={equipText}
              onChange={(e) => setEquipText(e.target.value)}
              placeholder="Escudo, Casco, Espada"
            />
          </div>
          <div>
            <Label htmlFor="imgs">Imágenes (una URL por línea, mínimo 1) *</Label>
            <Textarea
              id="imgs"
              required
              rows={3}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://...&#10;https://..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
