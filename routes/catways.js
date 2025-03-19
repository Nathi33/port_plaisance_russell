const express = require("express");
const router = express.Router();

const catwayService = require("../services/catways");

const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways
 */

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: "Obtenir la liste de tous les catways"
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: "Liste des catways récupérée avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       '401':
 *         description: "Non autorisé. L'utilisateur doit être authentifié."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.get("/", auth, catwayService.getAll);

/**
 * @swagger
 * /catways/add:
 *   post:
 *     summary: "Ajouter un nouveau catway"
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom du catway."
 *               description:
 *                 type: string
 *                 description: "Description du catway."
 *     responses:
 *       '201':
 *         description: "Catway ajouté avec succès."
 *       '400':
 *         description: "Requête invalide."
 *       '401':
 *         description: "Non autorisé. L'utilisateur doit être authentifié."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.post("/add", auth, catwayService.add);

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: "Supprimer un catway par son ID"
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du catway à supprimer."
 *     responses:
 *       '200':
 *         description: "Catway supprimé avec succès."
 *       '404':
 *         description: "Catway non trouvé."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.delete("/:id", auth, catwayService.delete);

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: "Obtenir un catway par son ID"
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du catway à récupérer."
 *     responses:
 *       '200':
 *         description: "Catway récupéré avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       '404':
 *         description: "Catway non trouvé."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.get("/:id", catwayService.getById);

/**
 * @swagger
 * /catways/update_catway/{id}:
 *   put:
 *     summary: "Mettre à jour un catway par son ID"
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du catway à mettre à jour."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom du catway."
 *               description:
 *                 type: string
 *                 description: "Description du catway."
 *     responses:
 *       '200':
 *         description: "Catway mis à jour avec succès."
 *       '400':
 *         description: "Requête invalide."
 *       '404':
 *         description: "Catway non trouvé."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.put("/update_catway/:id", catwayService.update);

/**
 * @swagger
 * /catways/partial_update_catway/{id}:
 *   patch:
 *     summary: "Mettre à jour partiellement un catway"
 *     tags: [Catways]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID du catway à mettre à jour."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Nom du catway."
 *               description:
 *                 type: string
 *                 description: "Description du catway."
 *     responses:
 *       '200':
 *         description: "Catway partiellement mis à jour avec succès."
 *       '400':
 *         description: "Requête invalide."
 *       '404':
 *         description: "Catway non trouvé."
 *       '500':
 *         description: "Erreur serveur interne."
 */
router.patch("/update_catway/:id", catwayService.partialUpdate);

module.exports = router;
