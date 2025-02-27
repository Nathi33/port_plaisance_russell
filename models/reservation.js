const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Le numéro de pont réservé pour cette réservation.
 * @property {string} clientName - Le nom du client qui effectue la réservation.
 * @property {string} boatName - Le nom du bateau associé à la réservation.
 * @property {Date} checkIn - La date de début de la réservation.
 * @property {Date} checkOut - La date de fin de la réservation.
 */

/**
 * Schéma représentant une réservation pour un catway dans la base de données.
 * Une réservation contient un numéro de catway, le nom du client, le nom du bateau,
 * ainsi que les dates de début et de fin de la réservation.
 *
 * @type {Schema}
 */
const Reservation = new Schema({
  /**
   * Le numéro de catway réservé.
   * Ce champ est requis et doit être un nombre.
   *
   * @type {number}
   * @required
   */
  catwayNumber: {
    type: Number,
    trim: true,
    required: [true, "Le numéro de pont réservé est requis"],
  },

  /**
   * Le nom du client effectuant la réservation.
   * Ce champ est requis et doit être une chaîne de caractères.
   *
   * @type {string}
   * @required
   */
  clientName: {
    type: String,
    trim: true,
    required: [true, "Le nom du client est requis"],
  },

  /**
   * Le nom du bateau associé à la réservation.
   * Ce champ est requis et doit être une chaîne de caractères.
   *
   * @type {string}
   * @required
   */
  boatName: {
    type: String,
    trim: true,
    required: [true, "Le nom du bateau est requis"],
  },

  /**
   * La date de début de la réservation.
   * Ce champ est requis et doit être une date valide.
   *
   * @type {Date}
   * @required
   */
  checkIn: {
    type: Date,
    required: [true, "La date de début de réservation est requise"],
  },

  /**
   * La date de fin de la réservation.
   * Ce champ est requis et doit être une date valide.
   *
   * @type {Date}
   * @required
   */
  checkOut: {
    type: Date,
    required: [true, "La date de fin de réservation est requise"],
  },
});

module.exports = mongoose.model("Reservation", Reservation);
