# Superhéroes SPA

Aplicación full stack para gestionar personajes de Marvel y DC.

- Frontend: React + TanStack Start + Vite.
- Backend: Node.js + Express + Mongoose.
- Base de datos: MongoDB.
- Imágenes: el backend resuelve imágenes desde una API pública de superhéroes y conserva un placeholder si no encuentra coincidencia.
- Docker: un `docker-compose.yml` global levanta todos los servicios.

## Requisitos

- Docker Desktop.
- Docker Compose.

## Levantar la app

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

Servicios:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000`
- MongoDB: `localhost:27017`

## Cargar datos de prueba

```bash
docker compose --profile seed run --rm seed
```

El seed carga 33 personajes Marvel/DC con imágenes resueltas desde:

```bash
https://akabab.github.io/superhero-api/api/all.json
```

La URL puede cambiarse con la variable `HERO_IMAGES_API_URL` en `docker-compose.yml`.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/superheroes` | Lista personajes. Query: `?casa=marvel\|dc&q=spi` |
| GET | `/api/superheroes/:id` | Detalle por id |
| POST | `/api/superheroes` | Crear personaje |
| PUT | `/api/superheroes/:id` | Actualizar personaje |
| DELETE | `/api/superheroes/:id` | Eliminar personaje |

## Modelo

```json
{
  "nombre": "Spider-Man",
  "nombreReal": "Peter Parker",
  "anioAparicion": 1962,
  "casa": "marvel",
  "tipo": "heroe",
  "biografia": "...",
  "equipamiento": ["Lanzatelarañas"],
  "imagenes": ["https://..."]
}
```

`casa`: `marvel` o `dc`.
`tipo`: `heroe` o `villano`.

Si `imagenes` viene vacío o solo contiene placeholders, el backend intenta resolver imágenes reales automáticamente.

## Rutas del frontend

- `/`: Home.
- `/marvel`: personajes Marvel.
- `/dc`: personajes DC.
- `/heroes/:id`: detalle con carrusel.

## Desarrollo local sin Docker

Backend:

```bash
cd backend
npm install
MONGO_URI=mongodb://localhost:27017/superheroes npm run dev
```

Seed:

```bash
cd backend
MONGO_URI=mongodb://localhost:27017/superheroes npm run seed
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Tests

```bash
cd backend
npm test
```

## Apagar

```bash
docker compose down
docker compose down -v
```

El primer comando conserva los datos. El segundo elimina el volumen de MongoDB.
