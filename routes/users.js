const express = require("express");
const router = express.Router();

const service = require("../services/users");

const auth = require("../middlewares/auth");

/**
 * @route GET /:id
 * @desc Récupère les informations d'un utilisateur spécifique.
 * @param {string} id - L'ID de l'utilisateur à récupérer.
 * @access Protégé (requiert un token JWT d'authentification)
 */
router.get("/:id", auth, service.getById);

/**
 * @route POST /add
 * @desc Ajoute un nouvel utilisateur.
 * @body {object} user - Données de l'utilisateur à ajouter.
 * @access Public
 */
router.post("/add", service.add);

/**
 * @route DELETE /:id
 * @desc Supprime un utilisateur spécifique.
 * @param {string} id - L'ID de l'utilisateur à supprimer.
 * @access Protégé (requiert un token JWT d'authentification)
 */
router.delete("/:id", auth, service.delete);

/**
 * @route PATCH /:id
 * @desc Modifie les informations d'un utilisateur spécifique.
 * @param {string} id - L'ID de l'utilisateur à modifier.
 * @body {object} user - Données à mettre à jour pour l'utilisateur.
 * @access Public
 */
router.patch("/:id", service.update);

/**
 * @route POST /authenticate
 * @desc Authentifie un utilisateur et retourne un token JWT.
 * @body {object} credentials - Identifiants (email et mot de passe) pour l'authentification.
 * @access Public
 */
router.post("/authenticate", service.authenticate);

module.exports = router;
