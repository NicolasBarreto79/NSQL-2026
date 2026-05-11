import "dotenv/config";
import mongoose from "mongoose";
import { Superhero } from "./models/Superhero.js";
import { fillHeroImages } from "./services/heroImages.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/superheroes";

const img = (name, color = "1f2937") =>
  `https://placehold.co/600x800/${color}/white?text=${encodeURIComponent(name)}`;

const M = "ef4444"; // marvel red
const D = "2563eb"; // dc blue
const V = "111827"; // villains dark

const data = [
  // ========= MARVEL HÉROES =========
  { nombre: "Spider-Man", nombreReal: "Peter Parker", anioAparicion: 1962, casa: "marvel", tipo: "heroe",
    biografia: "Joven de Queens picado por una araña radiactiva que obtuvo poderes arácnidos.",
    equipamiento: ["Lanzatelarañas", "Traje arácnido"],
    imagenes: [img("Spider-Man 1", M), img("Spider-Man 2", M), img("Spider-Man 3", M)] },
  { nombre: "Iron Man", nombreReal: "Tony Stark", anioAparicion: 1963, casa: "marvel", tipo: "heroe",
    biografia: "Genio multimillonario que construyó una armadura tecnológica para luchar contra el mal.",
    equipamiento: ["Armadura Mark L", "Reactor Arc", "JARVIS"],
    imagenes: [img("Iron Man 1", M), img("Iron Man 2", M)] },
  { nombre: "Captain America", nombreReal: "Steve Rogers", anioAparicion: 1941, casa: "marvel", tipo: "heroe",
    biografia: "Soldado mejorado con el suero del super-soldado durante la Segunda Guerra Mundial.",
    equipamiento: ["Escudo de vibranium"],
    imagenes: [img("Captain America 1", M), img("Captain America 2", M)] },
  { nombre: "Thor", nombreReal: "Thor Odinson", anioAparicion: 1962, casa: "marvel", tipo: "heroe",
    biografia: "Dios del trueno asgardiano, hijo de Odín y príncipe de Asgard.",
    equipamiento: ["Mjolnir", "Stormbreaker"],
    imagenes: [img("Thor 1", M), img("Thor 2", M)] },
  { nombre: "Hulk", nombreReal: "Bruce Banner", anioAparicion: 1962, casa: "marvel", tipo: "heroe",
    biografia: "Científico expuesto a rayos gamma que se transforma en una bestia verde imparable.",
    equipamiento: [],
    imagenes: [img("Hulk", M)] },
  { nombre: "Black Widow", nombreReal: "Natasha Romanoff", anioAparicion: 1964, casa: "marvel", tipo: "heroe",
    biografia: "Espía y asesina ex-KGB convertida en agente de S.H.I.E.L.D.",
    equipamiento: ["Aguijones de viuda", "Pistolas Glock"],
    imagenes: [img("Black Widow 1", M), img("Black Widow 2", M)] },
  { nombre: "Doctor Strange", nombreReal: "Stephen Strange", anioAparicion: 1963, casa: "marvel", tipo: "heroe",
    biografia: "Cirujano arrogante que tras un accidente se convirtió en el Hechicero Supremo.",
    equipamiento: ["Capa de Levitación", "Ojo de Agamotto"],
    imagenes: [img("Dr Strange 1", M), img("Dr Strange 2", M)] },
  { nombre: "Black Panther", nombreReal: "T'Challa", anioAparicion: 1966, casa: "marvel", tipo: "heroe",
    biografia: "Rey de Wakanda y protector de su nación gracias a la hierba en forma de corazón.",
    equipamiento: ["Traje de vibranium"],
    imagenes: [img("Black Panther 1", M), img("Black Panther 2", M)] },
  { nombre: "Wolverine", nombreReal: "James Howlett", anioAparicion: 1974, casa: "marvel", tipo: "heroe",
    biografia: "Mutante con factor de curación y esqueleto recubierto de adamantium.",
    equipamiento: ["Garras de adamantium"],
    imagenes: [img("Wolverine", M)] },
  { nombre: "Deadpool", nombreReal: "Wade Wilson", anioAparicion: 1991, casa: "marvel", tipo: "heroe",
    biografia: "Mercenario bocazas con factor de curación que rompe la cuarta pared.",
    equipamiento: ["Katanas", "Pistolas"],
    imagenes: [img("Deadpool 1", M), img("Deadpool 2", M)] },
  { nombre: "Scarlet Witch", nombreReal: "Wanda Maximoff", anioAparicion: 1964, casa: "marvel", tipo: "heroe",
    biografia: "Bruja con poderes de magia del caos capaz de alterar la realidad.",
    equipamiento: [],
    imagenes: [img("Scarlet Witch 1", M), img("Scarlet Witch 2", M)] },
  // ========= MARVEL VILLANOS =========
  { nombre: "Thanos", nombreReal: "", anioAparicion: 1973, casa: "marvel", tipo: "villano",
    biografia: "Titán Loco obsesionado con equilibrar el universo eliminando a la mitad de sus seres vivos.",
    equipamiento: ["Guantelete del Infinito"],
    imagenes: [img("Thanos 1", V), img("Thanos 2", V)] },
  { nombre: "Loki", nombreReal: "Loki Laufeyson", anioAparicion: 1962, casa: "marvel", tipo: "villano",
    biografia: "Dios del engaño asgardiano, hermano adoptivo de Thor.",
    equipamiento: ["Cetro", "Tesseract"],
    imagenes: [img("Loki 1", V), img("Loki 2", V)] },
  { nombre: "Magneto", nombreReal: "Erik Lehnsherr", anioAparicion: 1963, casa: "marvel", tipo: "villano",
    biografia: "Mutante maestro del magnetismo, líder de la Hermandad de Mutantes.",
    equipamiento: ["Casco anti-telepatía"],
    imagenes: [img("Magneto", V)] },
  { nombre: "Venom", nombreReal: "Eddie Brock", anioAparicion: 1988, casa: "marvel", tipo: "villano",
    biografia: "Periodista unido a un simbionte alienígena que le da poderes monstruosos.",
    equipamiento: ["Simbionte"],
    imagenes: [img("Venom 1", V), img("Venom 2", V)] },
  { nombre: "Green Goblin", nombreReal: "Norman Osborn", anioAparicion: 1964, casa: "marvel", tipo: "villano",
    biografia: "Empresario corrompido por un suero experimental, archienemigo de Spider-Man.",
    equipamiento: ["Planeador", "Bombas calabaza"],
    imagenes: [img("Green Goblin", V)] },

  // ========= DC HÉROES =========
  { nombre: "Batman", nombreReal: "Bruce Wayne", anioAparicion: 1939, casa: "dc", tipo: "heroe",
    biografia: "Multimillonario de Gotham que tras la muerte de sus padres lucha contra el crimen.",
    equipamiento: ["Batarangs", "Batimóvil", "Cinturón multiusos"],
    imagenes: [img("Batman 1", D), img("Batman 2", D), img("Batman 3", D)] },
  { nombre: "Superman", nombreReal: "Clark Kent", anioAparicion: 1938, casa: "dc", tipo: "heroe",
    biografia: "Último hijo de Krypton, criado en Kansas, protector de Metrópolis.",
    equipamiento: [],
    imagenes: [img("Superman 1", D), img("Superman 2", D)] },
  { nombre: "Wonder Woman", nombreReal: "Diana Prince", anioAparicion: 1941, casa: "dc", tipo: "heroe",
    biografia: "Princesa amazona de Themyscira con fuerza y velocidad sobrehumanas.",
    equipamiento: ["Lazo de la Verdad", "Brazaletes", "Espada"],
    imagenes: [img("Wonder Woman 1", D), img("Wonder Woman 2", D)] },
  { nombre: "Flash", nombreReal: "Barry Allen", anioAparicion: 1956, casa: "dc", tipo: "heroe",
    biografia: "Forense alcanzado por un rayo y químicos que le dieron supervelocidad.",
    equipamiento: ["Traje rojo"],
    imagenes: [img("Flash 1", D), img("Flash 2", D)] },
  { nombre: "Aquaman", nombreReal: "Arthur Curry", anioAparicion: 1941, casa: "dc", tipo: "heroe",
    biografia: "Rey de Atlantis, mitad humano mitad atlante, comandante de los océanos.",
    equipamiento: ["Tridente de Atlan"],
    imagenes: [img("Aquaman 1", D), img("Aquaman 2", D)] },
  { nombre: "Green Lantern", nombreReal: "Hal Jordan", anioAparicion: 1959, casa: "dc", tipo: "heroe",
    biografia: "Piloto reclutado por los Guardianes para portar el anillo del Cuerpo de Linternas Verdes.",
    equipamiento: ["Anillo de poder", "Linterna"],
    imagenes: [img("Green Lantern", D)] },
  { nombre: "Cyborg", nombreReal: "Victor Stone", anioAparicion: 1980, casa: "dc", tipo: "heroe",
    biografia: "Atleta universitario reconstruido con tecnología alienígena tras un accidente.",
    equipamiento: ["Cañón sónico"],
    imagenes: [img("Cyborg 1", D), img("Cyborg 2", D)] },
  { nombre: "Green Arrow", nombreReal: "Oliver Queen", anioAparicion: 1941, casa: "dc", tipo: "heroe",
    biografia: "Multimillonario de Star City, arquero experto vigilante de la noche.",
    equipamiento: ["Arco compuesto", "Flechas trucadas"],
    imagenes: [img("Green Arrow", D)] },
  { nombre: "Shazam", nombreReal: "Billy Batson", anioAparicion: 1940, casa: "dc", tipo: "heroe",
    biografia: "Niño que al gritar 'Shazam' se transforma en un héroe adulto con poderes mágicos.",
    equipamiento: [],
    imagenes: [img("Shazam 1", D), img("Shazam 2", D)] },
  { nombre: "Nightwing", nombreReal: "Dick Grayson", anioAparicion: 1984, casa: "dc", tipo: "heroe",
    biografia: "Primer Robin que dejó el manto de su mentor para forjar su propia identidad.",
    equipamiento: ["Escrimas eléctricas"],
    imagenes: [img("Nightwing", D)] },
  { nombre: "Supergirl", nombreReal: "Kara Zor-El", anioAparicion: 1959, casa: "dc", tipo: "heroe",
    biografia: "Prima de Superman, también superviviente de Krypton.",
    equipamiento: [],
    imagenes: [img("Supergirl 1", D), img("Supergirl 2", D)] },
  { nombre: "Batgirl", nombreReal: "Barbara Gordon", anioAparicion: 1967, casa: "dc", tipo: "heroe",
    biografia: "Hija del comisionado Gordon, vigilante de Gotham y aliada de Batman.",
    equipamiento: ["Batarangs", "Cinturón"],
    imagenes: [img("Batgirl", D)] },

  // ========= DC VILLANOS =========
  { nombre: "Joker", nombreReal: "", anioAparicion: 1940, casa: "dc", tipo: "villano",
    biografia: "Príncipe payaso del crimen, archienemigo de Batman en Gotham.",
    equipamiento: ["Gas de la risa", "Naipes afilados"],
    imagenes: [img("Joker 1", V), img("Joker 2", V), img("Joker 3", V)] },
  { nombre: "Lex Luthor", nombreReal: "Alexander Luthor", anioAparicion: 1940, casa: "dc", tipo: "villano",
    biografia: "Magnate genio enemigo mortal de Superman.",
    equipamiento: ["Armadura de batalla", "Kryptonita"],
    imagenes: [img("Lex Luthor 1", V), img("Lex Luthor 2", V)] },
  { nombre: "Harley Quinn", nombreReal: "Harleen Quinzel", anioAparicion: 1992, casa: "dc", tipo: "villano",
    biografia: "Psiquiatra obsesionada con el Joker que se convirtió en su cómplice.",
    equipamiento: ["Mazo gigante", "Bate de béisbol"],
    imagenes: [img("Harley Quinn 1", V), img("Harley Quinn 2", V)] },
  { nombre: "Darkseid", nombreReal: "Uxas", anioAparicion: 1970, casa: "dc", tipo: "villano",
    biografia: "Tirano de Apokolips, busca la Ecuación Anti-Vida para esclavizar el universo.",
    equipamiento: ["Rayos Omega"],
    imagenes: [img("Darkseid", V)] },
  { nombre: "Deathstroke", nombreReal: "Slade Wilson", anioAparicion: 1980, casa: "dc", tipo: "villano",
    biografia: "Mercenario mejorado genéticamente con uso del 90% de su cerebro.",
    equipamiento: ["Espada", "Pistolas", "Bastón"],
    imagenes: [img("Deathstroke", V)] },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB");
  await Superhero.deleteMany({});
  console.log("🗑️  Colección limpiada");
  const dataWithImages = await Promise.all(data.map((hero) => fillHeroImages(hero)));
  const created = await Superhero.insertMany(dataWithImages);
  console.log(`🦸 Insertados ${created.length} personajes (${created.filter(c => c.casa==='marvel').length} Marvel, ${created.filter(c => c.casa==='dc').length} DC)`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
