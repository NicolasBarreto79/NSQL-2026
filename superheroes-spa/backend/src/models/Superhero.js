import mongoose from "mongoose";

const superheroSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, index: true },
    nombreReal: { type: String, trim: true, default: "" },
    anioAparicion: { type: Number, required: true },
    casa: {
      type: String,
      required: true,
      enum: ["marvel", "dc"],
      lowercase: true,
      index: true,
    },
    biografia: { type: String, required: true },
    equipamiento: { type: [String], default: [] },
    imagenes: {
      type: [String],
      validate: [(v) => v.length >= 1, "Debe tener al menos una imagen"],
      required: true,
    },
    tipo: { type: String, enum: ["heroe", "villano"], default: "heroe" },
  },
  { timestamps: true }
);

superheroSchema.virtual("cantidadImagenes").get(function () {
  return this.imagenes?.length ?? 0;
});

superheroSchema.set("toJSON", { virtuals: true });

export const Superhero = mongoose.model("Superhero", superheroSchema);
