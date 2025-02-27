const express = require("express");
const path = require("path");
const router = express.Router();

// Configuration de la route de la documentation
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
