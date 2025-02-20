const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

// Route protégée pour afficher le dashboard
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Récupère l'utilisateur par son id et exclut le mot de passe
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }
    res.render("dashboard", {
      title: "Dashboard",
      user,
      successMessage: req.flash("successMessage"),
      errorMessage: req.flash("errorMessage"),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
