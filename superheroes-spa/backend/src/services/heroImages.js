const DEFAULT_API_URL =
  "https://akabab.github.io/superhero-api/api/all.json";

const API_URL = process.env.HERO_IMAGES_API_URL || DEFAULT_API_URL;

let heroesCachePromise;

const NAME_ALIASES = {
  "green lantern": ["hal jordan"],
  shazam: ["captain marvel"],
};

function normalizeName(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function placeholderFor(hero) {
  const color = hero.casa === "dc" ? "2563eb" : "ef4444";
  return `https://placehold.co/600x800/${color}/white?text=${encodeURIComponent(
    hero.nombre || "Superhero",
  )}`;
}

function isPlaceholderImage(url) {
  return typeof url === "string" && url.includes("placehold.co/");
}

function usableExistingImages(images) {
  return Array.isArray(images) && images.length > 0 && images.some((url) => !isPlaceholderImage(url));
}

async function loadExternalHeroes(fetchImpl = fetch) {
  if (!heroesCachePromise) {
    heroesCachePromise = fetchImpl(API_URL).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Hero image API returned ${res.status}`);
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    });
  }
  return heroesCachePromise;
}

function findHeroMatch(hero, externalHeroes) {
  const target = normalizeName(hero.nombre);
  const targets = [
    target,
    normalizeName(hero.nombreReal),
    ...(NAME_ALIASES[target] ?? []),
  ].filter(Boolean);

  const exact = externalHeroes.find((item) => targets.includes(normalizeName(item.name)));
  if (exact) return exact;

  return externalHeroes.find((item) => {
    const name = normalizeName(item.name);
    return targets.some((candidate) => name.includes(candidate) || candidate.includes(name));
  });
}

function imagesFromMatch(match) {
  const images = match?.images ?? {};
  return [images.lg, images.md, images.sm].filter(Boolean);
}

export async function fetchHeroImages(hero, { fetchImpl = fetch } = {}) {
  try {
    const externalHeroes = await loadExternalHeroes(fetchImpl);
    const match = findHeroMatch(hero, externalHeroes);
    const images = imagesFromMatch(match);
    return images.length > 0 ? images : [placeholderFor(hero)];
  } catch (error) {
    console.warn(`No se pudieron resolver imágenes para ${hero.nombre}:`, error.message);
    return [placeholderFor(hero)];
  }
}

export async function fillHeroImages(hero, options = {}) {
  if (usableExistingImages(hero.imagenes)) {
    return hero;
  }

  return {
    ...hero,
    imagenes: await fetchHeroImages(hero, options),
  };
}

export function resetHeroImagesCache() {
  heroesCachePromise = undefined;
}
