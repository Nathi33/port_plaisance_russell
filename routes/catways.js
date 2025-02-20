const express = require("express");
const router = express.Router();

const catwayService = require("../services/catways");

const auth = require("../middlewares/auth");

// Route pour lire les informations de tous les catways
router.get("/", catwayService.getAll);

// Route pour lire les informations d'un catway
router.get("/:id", catwayService.getById);

// Route pour ajouter un catway
router.post("/add", auth, catwayService.add);

// Route pour mettre à jour un catway
router.put("/update_catway/:id", catwayService.update);

// Route pour mettre à jour partiellement un catway
router.patch("/:id", catwayService.partialUpdate);

// Route pour supprimer un catway
router.delete("/:id", auth, catwayService.delete);

module.exports = router;
