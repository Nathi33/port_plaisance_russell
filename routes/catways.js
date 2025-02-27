const express = require("express");
const router = express.Router();

const catwayService = require("../services/catways");

const auth = require("../middlewares/auth");

/**
 * Route pour lire les informations de tous les catways.
 *
 * Cette route permet de récupérer toutes les informations sur les catways.
 * Elle est protégée par un middleware d'authentification JWT.
 *
 * @route GET /catways
 * @desc Récupère toutes les informations sur les catways.
 * @access Protégé (requiert un token JWT d'authentification)
 * @returns {Array} Liste de tous les catways.
 */
router.get("/", auth, catwayService.getAll);

/**
 * Route pour ajouter un catway.
 *
 * Cette route permet d'ajouter un nouveau catway dans la base de données.
 * Elle est protégée par un middleware d'authentification JWT.
 *
 * @route POST /catways/add
 * @desc Ajoute un nouveau catway dans la base de données.
 * @access Protégé (requiert un token JWT d'authentification)
 * @body {Object} catway - Données du catway à ajouter.
 * @returns {Object} Catway créé.
 */
router.post("/add", auth, catwayService.add);

/**
 * Route pour supprimer un catway.
 *
 * Cette route permet de supprimer un catway en fonction de son ID.
 * Elle est protégée par un middleware d'authentification JWT.
 *
 * @route DELETE /catways/:id
 * @desc Supprime un catway en fonction de son ID.
 * @access Protégé (requiert un token JWT d'authentification)
 * @param {string} id - L'ID du catway à supprimer.
 */
router.delete("/:id", auth, catwayService.delete);

/**
 * Route pour lire les informations d'un catway spécifique.
 *
 * Cette route permet de récupérer les informations d'un catway à partir de son ID.
 * Elle est publique, c'est-à-dire accessible sans authentification.
 *
 * @route GET /catways/:id
 * @param {string} id - L'ID du catway à récupérer.
 * @returns {Object} Détails du catway.
 */
router.get("/:id", catwayService.getById);

/**
 * Route pour mettre à jour un catway.
 *
 * Cette route permet de mettre à jour les informations d'un catway spécifique à partir de son ID.
 * Elle est publique.
 *
 * @route PUT /catways/update_catway/:id
 */
router.put("/update_catway/:id", catwayService.update);

/**
 * Route pour mettre à jour partiellement un catway.
 *
 * Cette route permet de mettre à jour partiellement les informations d'un catway à partir de son ID.
 *
 * @route PATCH /catways/update_catway/:id
 * @desc Met à jour les informations d'un catway spécifique.
 * @access Public
 * @param {string} id - L'ID du catway à mettre à jour.
 * @body {Object} catway - Données à mettre à jour pour le catway.
 * @returns {Object} Catway mis à jour.
 */
router.patch("/update_catway/:id", catwayService.partialUpdate);

module.exports = router;
