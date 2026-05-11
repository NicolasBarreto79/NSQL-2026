import type { Superhero, SuperheroInput, Casa } from "./types";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:3000/api";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  list: (casa?: Casa) =>
    http<Superhero[]>(`/superheroes${casa ? `?casa=${casa}` : ""}`),
  get: (id: string) => http<Superhero>(`/superheroes/${id}`),
  create: (data: SuperheroInput) =>
    http<Superhero>(`/superheroes`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: SuperheroInput) =>
    http<Superhero>(`/superheroes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    http<{ ok: boolean }>(`/superheroes/${id}`, { method: "DELETE" }),
};

export { API_URL };
