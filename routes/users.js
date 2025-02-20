const express = require("express");
const router = express.Router();

const service = require("../services/users");

const auth = require("../middlewares/auth");

// Routes protégées avec JWT
router.get("/:id", auth, service.getById); // Route pour lire les informations d'un utilisateur
router.patch("/:id", auth, service.update); // Route pour modifier un utilisateur
router.delete("/:id", auth, service.delete); // Route pour supprimer un utilisateur

// Route publique pour ajouter un utilisateur
router.post("/add", service.add);

// Route pour l'authentification
router.post("/authenticate", service.authenticate);

module.exports = router;
