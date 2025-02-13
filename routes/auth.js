const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

// Route pour afficher la page de connexion
router.get("/", async (req, res) => {
  res.render("login", { title: "Connexion" });
});

// Route pour gérer la soumission du formulaire de connexion
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user._id;
    return res.redirect("/dashboard");
  } else {
    return res.render("login", {
      title: "Connexion",
      error: "Adresse email ou mot de passe incorrect",
    });
  }
});

module.exports = router;
