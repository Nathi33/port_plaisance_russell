const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Création du schéma Catway
const Catway = new Schema({
  catwayNumber: {
    type: Number,
    trim: true,
    required: [true, "Le numéro de pont est requis"],
  },
  type: {
    type: String,
    trim: true,
    enum: ["long", "short"],
    required: [true, "Le type de pont 'long' ou 'court' est requis"],
  },
  catwayState: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Catway", Catway);
