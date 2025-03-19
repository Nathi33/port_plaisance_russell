const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Gestion du tableau de bord de l'utilisateur
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: "Obtenir les informations du tableau de bord de l'utilisateur"
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []  # Assurez-vous que 'bearerAuth' est bien défini dans votre Swagger global
 *     responses:
 *       '200':
 *         description: "Données du tableau de bord de l'utilisateur récupérées avec succès."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 successMessage:
 *                   type: string
 *                   description: "Message de succès, si disponible."
 *                 errorMessage:
 *                   type: string
 *                   description: "Message d'erreur, si disponible."
 *       '401':
 *         description: "Utilisateur non trouvé ou authentification échouée."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Message d'erreur."
 *       '500':
 *         description: "Erreur serveur interne lors de la récupération de l'utilisateur."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: "Message d'erreur."
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
