export type Casa = "marvel" | "dc";
export type Tipo = "heroe" | "villano";

export interface Superhero {
  _id: string;
  nombre: string;
  nombreReal?: string;
  anioAparicion: number;
  casa: Casa;
  tipo?: Tipo;
  biografia: string;
  equipamiento?: string[];
  imagenes: string[];
}

export type SuperheroInput = Omit<Superhero, "_id">;
