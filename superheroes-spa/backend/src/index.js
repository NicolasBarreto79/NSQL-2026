import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import superheroesRouter from "./routes/superheroes.js";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/superheroes";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/superheroes", superheroesRouter);

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Error interno" });
});

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB:", MONGO_URI);
  app.listen(PORT, () => console.log(`🚀 API en http://localhost:${PORT}`));
}

start().catch((e) => {
  console.error("Error iniciando:", e);
  process.exit(1);
});
