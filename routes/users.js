const express = require("express");
const router = express.Router();

const service = require("../services/users");

// Route pour lire les informations d'un utilisateur
router.get("/:id", service.getById);
// Route pour ajouter un utilisateur
router.put("/add", service.add);
// Route pour modifier un utilisateur
router.patch("/:id", service.update);
// Route pour supprimer un utilisateur
router.delete("/:id", service.delete);

module.exports = router;
