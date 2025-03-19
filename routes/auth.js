const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey"; // Clé secrète pour le token JWT

const cookieParser = require("cookie-parser");
router.use(cookieParser());

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: "Afficher la page de connexion"
 *     tags:
 *       - Auth
 *     responses:
 *       '200':
 *         description: "Page de connexion rendue avec succès."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.get("/", async (req, res) => {
  res.render("login", { title: "Connexion" });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: "Connexion de l'utilisateur"
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: "Adresse email de l'utilisateur."
 *               password:
 *                 type: string
 *                 description: "Mot de passe de l'utilisateur."
 *     responses:
 *       '200':
 *         description: "Utilisateur connecté avec succès et token JWT généré."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur connecté avec succès"
 *                 token:
 *                   type: string
 *                   example: "jwt_token_here"
 *       '401':
 *         description: "Adresse email ou mot de passe incorrect."
 *       '500':
 *         description: "Erreur serveur interne."
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
 * @swagger
 * /logout:
 *   post:
 *     summary: "Déconnexion de l'utilisateur"
 *     tags:
 *       - Auth
 *     responses:
 *       '200':
 *         description: "Utilisateur déconnecté avec succès."
 *       '500':
 *         description: "Erreur serveur interne."
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
