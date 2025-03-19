const express = require("express");
const router = express.Router();

const reservationService = require("../services/reservations");

const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations pour les catways
 */

/**
 * @swagger
 * /catways/{catwayId}/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations pour un catway spécifique
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du catway pour lequel récupérer les réservations
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       404:
 *         description: Catway non trouvé
 */
router.get("/:catwayId/reservations", auth, reservationService.getAllByCatway);

/**
 * @swagger
 * /catways/{catwayId}/reservations:
 *   post:
 *     summary: Créer une nouvelle réservation pour un catway spécifique
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du catway pour lequel ajouter une réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 example: "John Doe"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-10"
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/:catwayId/reservations", auth, reservationService.add);

/**
 * @swagger
 * /catways/{catwayNumber}/reservations/{reservationId}:
 *   delete:
 *     summary: Supprimer une réservation pour un catway spécifique
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Le numéro du catway associé à la réservation
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la réservation à supprimer
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 */
router.delete(
  "/:catwayNumber/reservations/:reservationId",
  auth,
  reservationService.delete
);

/**
 * @swagger
 * /catways/{catwayId}/reservations/{reservationId}:
 *   get:
 *     summary: Récupérer les détails d'une réservation spécifique pour un catway
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du catway
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la réservation à récupérer
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *       404:
 *         description: Réservation non trouvée
 */
router.get(
  "/:catwayId/reservations/:reservationId",
  reservationService.getById
);

module.exports = router;
