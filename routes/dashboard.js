const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

/**
 * Route pour afficher le dashboard d'un utilisateur.
 *
 * Cette route permet de récupérer les informations d'un utilisateur spécifique en utilisant son ID.
 * L'utilisateur doit être authentifié via le middleware d'authentification JWT.
 *
 * @route GET /dashboard
 * @returns {Object} Vue du dashboard avec les informations de l'utilisateur,
 *                   le message de succès ou d'erreur le cas échéant.
 * @throws {Object} 401 - Si l'utilisateur n'est pas trouvé.
 * @throws {Object} 500 - Si une erreur serveur se produit.
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
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
