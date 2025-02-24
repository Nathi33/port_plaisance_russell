const express = require("express");
const router = express.Router();

const service = require("../services/users");

const auth = require("../middlewares/auth");

// Routes protégées avec JWT
router.get("/:id", auth, service.getById); // Route pour lire les informations d'un utilisateur
router.post("/add", service.add); // Route pour ajouter un utilisateur
router.delete("/:id", auth, service.delete); // Route pour supprimer un utilisateur

// Routes publiques pour ajouter un utilisateur
router.patch("/:id", service.update); // Route pour modifier un utilisateur
router.post("/authenticate", service.authenticate); // Route pour l'authentification d'un utilisateur

module.exports = router;
