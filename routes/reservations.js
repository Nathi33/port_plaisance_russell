const express = require("express");
const router = express.Router();

const reservationService = require("../services/reservations");

const auth = require("../middlewares/auth");

/**
 * @route GET /:catwayId/reservations
 * @desc Récupère toutes les réservations pour un catway spécifique.
 * @param {string} catwayId - L'ID du catway pour lequel récupérer les réservations.
 * @access Protégé (requiert un token JWT d'authentification)
 */
router.get("/:catwayId/reservations", auth, reservationService.getAllByCatway);

/**
 * @route POST /:catwayId/reservations
 * @desc Crée une nouvelle réservation pour un catway spécifique.
 * @param {string} catwayId - L'ID du catway pour lequel ajouter une réservation.
 * @body {object} reservation - Données de la réservation à ajouter.
 * @access Protégé (requiert un token JWT d'authentification)
 */
router.post("/:catwayId/reservations", auth, reservationService.add);

/**
 * @route DELETE /:catwayNumber/reservations/:reservationId
 * @desc Supprime une réservation pour un catway spécifique.
 * @param {string} catwayNumber - Le numéro du catway associé à la réservation.
 * @param {string} reservationId - L'ID de la réservation à supprimer.
 * @access Protégé (requiert un token JWT d'authentification)
 */
router.delete(
  "/:catwayNumber/reservations/:reservationId",
  auth,
  reservationService.delete
);

/**
 * @route GET /:catwayId/reservations/:reservationId
 * @desc Récupère les détails d'une réservation spécifique pour un catway.
 * @param {string} catwayId - L'ID du catway.
 * @param {string} reservationId - L'ID de la réservation à récupérer.
 * @access Public
 */
router.get(
  "/:catwayId/reservations/:reservationId",
  reservationService.getById
);

module.exports = router;
