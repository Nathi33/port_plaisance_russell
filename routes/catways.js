const express = require("express");
const router = express.Router();

const catwayService = require("../services/catways");

const auth = require("../middlewares/auth");

// Routes protégées avec JWT
router.get("/", auth, catwayService.getAll); // Route pour lire les informations de tous les catways
router.post("/add", auth, catwayService.add); // Route pour ajouter un catway
router.delete("/:id", auth, catwayService.delete); // Route pour supprimer un catway

// Routes publiques
router.get("/:id", catwayService.getById); // Route pour lire les informations d'un catway
router.put("/update_catway/:id", catwayService.update); // Route pour mettre à jour un catway
router.patch("/update_catway/:id", catwayService.partialUpdate); // Route pour mettre à jour partiellement un catway

module.exports = router;
