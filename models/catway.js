const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Le numéro de pont unique pour chaque catway.
 * @property {string} type - Le type de catway, soit 'long' ou 'short'.
 * @property {string} [catwayState] - La description du catway.
 */

/**
 * Schéma représentant un Catway dans la base de données.
 * Un catway est un pont avec un numéro unique, un type (court ou long) et un état.
 *
 * @type {Schema}
 */
const Catway = new Schema({
  /**
   * Le numéro unique du catway.
   * Ce champ est requis et doit être un nombre.
   *
   * @type {number}
   * @required
   */
  catwayNumber: {
    type: Number,
    trim: true,
    required: [true, "Le numéro de pont est requis"],
  },

  /**
   * Le type de catway.
   * Il peut être 'long' ou 'short', et ce champ est requis.
   *
   * @type {string}
   * @enum ["long", "short"]
   * @required
   */
  type: {
    type: String,
    trim: true,
    enum: ["long", "short"],
    required: [true, "Le type de pont 'long' ou 'court' est requis"],
  },

  /**
   * L'état du catway.
   * Ce champ est optionnel et peut décrire l'état actuel du catway.
   *
   * @type {string}
   */
  catwayState: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Catway", Catway);
