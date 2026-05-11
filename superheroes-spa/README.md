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
