const express = require("express");
const router = express.Router();

const service = require("../services/users");

const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer les informations d'un utilisateur spécifique
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/:id", auth, service.getById);

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Ajouter un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Utilisateur ajouté
 */
router.post("/add", service.add);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete("/:id", auth, service.delete);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Modifier les informations d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de l'utilisateur à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
router.patch("/:id", service.update);

/**
 * @swagger
 * /users/authenticate:
 *   post:
 *     summary: Authentifier un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Authentification réussie, retourne un token JWT
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/authenticate", service.authenticate);

module.exports = router;
