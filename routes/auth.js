const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey"; // Clé secrète pour le token JWT

const cookieParser = require("cookie-parser");
router.use(cookieParser());

// Route pour afficher la page de connexion
router.get("/", async (req, res) => {
  res.render("login", { title: "Connexion" });
});

// Route pour gérer la connexion et renvoyer un token JWT
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res
      .status(401)
      .json({ error: "Adresse mail ou mot de passe incorrect" });
  }

  // Génération du token JWT
  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

  // Stocker le token dans un cookie sécurisé
  res.cookie("jwtToken", token, {
    httpOnly: true, // Sécurité pour empêcher l'accès au cookie par JavaScript
    secure: false, // true en production pour HTTPS
    maxAge: 3600000, // Durée de vie du cookie : 1h
    sameSite: "lax", // Protection contre les attaques CSRF
  });

  res.redirect("/dashboard");
});

// Route pour se déconnecter
router.post("/logout", (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: false, // A modifier en production false => true
    sameSite: "lax",
  });
  res.redirect("/");
});

module.exports = router;
