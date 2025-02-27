const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey"; // Clé secrète pour le token JWT

const cookieParser = require("cookie-parser");
router.use(cookieParser());

/**
 * Route pour afficher la page de connexion.
 *
 * Cette route sert à afficher la page de connexion lorsque l'utilisateur navigue vers la page de login.
 * Elle ne nécessite aucune authentification préalable.
 *
 * @route GET /login
 * @returns {Object} Page HTML de connexion.
 */
router.get("/", async (req, res) => {
  res.render("login", { title: "Connexion" });
});

/**
 * Route pour gérer la connexion d'un utilisateur et renvoyer un token JWT.
 *
 * Lorsqu'un utilisateur soumet son email et son mot de passe, cette route valide les informations.
 * Si elles sont correctes, un token JWT est généré et stocké dans un cookie.
 * Le token est valide pendant 1 heure et sert à authentifier l'utilisateur pour ses prochaines requêtes.
 *
 * @route POST /login
 * @param {string} email - L'email de l'utilisateur pour l'authentification.
 * @param {string} password - Le mot de passe de l'utilisateur pour l'authentification.
 * @returns {Object} Token JWT dans un cookie si l'authentification réussit, erreur 401 si elle échoue.
 * @throws {Object} 401 - Si l'email ou le mot de passe est incorrect.
 */
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

/**
 * Route pour se déconnecter.
 *
 * Cette route permet de déconnecter un utilisateur en supprimant le cookie contenant le token JWT.
 *
 * @route POST /login/logout
 * @returns {Object} Redirection vers la page d'accueil après la déconnexion.
 */
router.post("/logout", (req, res) => {
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: false, // A modifier en production false => true
    sameSite: "lax",
  });
  res.redirect("/");
});

module.exports = router;
