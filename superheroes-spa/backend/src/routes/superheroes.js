import { Router } from "express";
import { Superhero } from "../models/Superhero.js";
import { fillHeroImages } from "../services/heroImages.js";

const router = Router();

// GET /api/superheroes?casa=marvel&q=spider
router.get("/", async (req, res, next) => {
  try {
    const { casa, q } = req.query;
    const filter = {};
    if (casa) filter.casa = String(casa).toLowerCase();
    if (q) filter.nombre = { $regex: String(q), $options: "i" };
    const data = await Superhero.find(filter).sort({ nombre: 1 });
    res.json(data);
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const hero = await Superhero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: "No encontrado" });
    res.json(hero);
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = await fillHeroImages(req.body);
    const hero = await Superhero.create(payload);
    res.status(201).json(hero);
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const payload = await fillHeroImages(req.body);
    const hero = await Superhero.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!hero) return res.status(404).json({ error: "No encontrado" });
    res.json(hero);
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const hero = await Superhero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ error: "No encontrado" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
