const express = require("express");
const router = express.Router();

const reservationService = require("../services/reservations");

// Route pour lire toutes les réservations pour un catway
router.get("/:catwayId/reservations", reservationService.getAllByCatway);

// Route pour lire le détail d'une réservation pour un catway
router.get(
  "/:catwayId/reservations/:reservationId",
  reservationService.getById
);

// Route pour ajouter une réservation pour un catway
router.post("/:catwayId/reservations", reservationService.add);

// Route pour supprimer une réservation pour un catway
router.delete(
  "/:catwayNumber/reservations/:reservationId",
  reservationService.delete
);

module.exports = router;
