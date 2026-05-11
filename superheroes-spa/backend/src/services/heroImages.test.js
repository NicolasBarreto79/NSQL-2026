import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  fetchHeroImages,
  fillHeroImages,
  resetHeroImagesCache,
} from "./heroImages.js";

afterEach(() => {
  resetHeroImagesCache();
});

test("fetchHeroImages returns API images for an exact superhero name", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return Response.json([
      {
        name: "Spider-Man",
        images: {
          md: "https://cdn.example/spider-man-md.jpg",
          lg: "https://cdn.example/spider-man-lg.jpg",
        },
      },
    ]);
  };

  const images = await fetchHeroImages(
    { nombre: "Spider-Man", casa: "marvel" },
    { fetchImpl },
  );

  assert.deepEqual(images, [
    "https://cdn.example/spider-man-lg.jpg",
    "https://cdn.example/spider-man-md.jpg",
  ]);
  assert.equal(calls.length, 1);
});

test("fetchHeroImages falls back to a generated placeholder when the API has no match", async () => {
  const images = await fetchHeroImages(
    { nombre: "Unknown Hero", casa: "dc" },
    { fetchImpl: async () => Response.json([]) },
  );

  assert.deepEqual(images, [
    "https://placehold.co/600x800/2563eb/white?text=Unknown%20Hero",
  ]);
});

test("fetchHeroImages uses known aliases when the API stores a character by another name", async () => {
  const images = await fetchHeroImages(
    { nombre: "Green Lantern", nombreReal: "Hal Jordan", casa: "dc" },
    {
      fetchImpl: async () =>
        Response.json([
          {
            name: "Hal Jordan",
            images: {
              lg: "https://cdn.example/hal-jordan.jpg",
            },
          },
        ]),
    },
  );

  assert.deepEqual(images, ["https://cdn.example/hal-jordan.jpg"]);
});

test("fillHeroImages keeps provided non-placeholder images", async () => {
  const hero = {
    nombre: "Batman",
    casa: "dc",
    imagenes: ["https://example.com/batman.jpg"],
  };

  const filled = await fillHeroImages(hero, {
    fetchImpl: async () => {
      throw new Error("fetch should not be called");
    },
  });

  assert.deepEqual(filled, hero);
});
