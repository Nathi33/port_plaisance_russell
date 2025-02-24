const express = require("express");
const router = express.Router();

const reservationService = require("../services/reservations");

const auth = require("../middlewares/auth");

// Routes protégées avec JWT
router.get("/:catwayId/reservations", auth, reservationService.getAllByCatway); // Route pour lire toutes les réservations pour un catway

router.post("/:catwayId/reservations", auth, reservationService.add); // Route pour ajouter une réservation pour un catway
router.delete(
  "/:catwayNumber/reservations/:reservationId",
  auth,
  reservationService.delete
); // Route pour supprimer une réservation pour un catway

// Routes publiques
router.get(
  "/:catwayId/reservations/:reservationId",
  reservationService.getById
); // Route pour lire le détail d'une réservation pour un catway

module.exports = router;
