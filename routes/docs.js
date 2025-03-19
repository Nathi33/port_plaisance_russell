const express = require("express");
const path = require("path");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Docs
 *   description: Gestion de la documentation de l'API
 */

/**
 * @swagger
 * /docs:
 *   get:
 *     summary: "Accéder à la documentation de l'API"
 *     tags:
 *       - Docs
 *     responses:
 *       '200':
 *         description: "La documentation est affichée avec succès."
 *       '500':
 *         description: "Erreur lors du chargement de la documentation."
 */
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../docs/index.html");
  console.log("Tentative d'accès au fichier :", filePath);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Erreur d'accès au fichier :", err);
      res.status(500).send("Erreur lors du chargement de la documentation");
    }
  });
});

module.exports = router;
