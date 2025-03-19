const express = require("express");
const router = express.Router();

const userRoute = require("../routes/users");
const catwayRoute = require("../routes/catways");
const reservationRoute = require("../routes/reservations");
const authRoute = require("../routes/auth");

const Catway = require("../models/catway");
const Reservation = require("../models/reservation");
const User = require("../models/user");

const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Index
 *   description: Gestion des routes de la page d'accueil
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Affiche la page d'accueil
 *     tags: [Index]
 *     responses:
 *       200:
 *         description: Vue de la page d'accueil
 *       500:
 *         description: Erreur serveur interne
 */
router.get("/", async (req, res) => {
  res.render("index", { title: "Connexion" });
});

/**
 * @swagger
 * /registration:
 *   get:
 *     summary: Affiche la page d'inscription des membres
 *     tags: [Index]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vue de la page d'inscription
 *       500:
 *         description: Erreur serveur interne
 */
router.get("/registration", auth, async (req, res) => {
  res.render("users/registration", { title: "Inscription" });
});

/**
 * @swagger
 * /update/{id}:
 *   get:
 *     summary: Affiche la page de mise à jour d'un membre
 *     tags: [Index]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du membre à mettre à jour.
 *     responses:
 *       200:
 *         description: Vue de la page de mise à jour des informations du membre
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/update/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("errorMessage", "Utilisateur introuvable !");
      return res.redirect("/dashboard");
    }
    res.render("users/update_member", {
      user,
      successMessage: req.flash("success"),
      errorMessage: req.flash("error"),
    });
  } catch (error) {
    console.error("Erreur:", error);
    req.flash("errorMessage", "Erreur lors du chargement des informations !");
    res.redirect("/dashboard");
  }
});

/**
 * @swagger
 * /delete_member:
 *   get:
 *     summary: Affiche la page de suppression d'un membre
 *     tags: [Index]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vue de la page de suppression d'un membre
 *       500:
 *         description: Erreur serveur interne
 */

router.get("/delete_member", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      req.flash("errorMessage", "Utilisateur non trouvé !");
      return res.redirect("/dashboard");
    }
    res.render("users/delete_member", {
      title: "Suppression d'un membre",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error);
    req.flash("errorMessage", "Erreur serveur !");
    return res.redirect("/dashboard");
  }
});

/**
 * @swagger
 * /list_reservations:
 *   get:
 *     summary: Affiche la liste des réservations
 *     tags: [Index]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vue de la liste des réservations
 *       500:
 *         description: Erreur lors de la récupération des réservations
 */
router.get("/list_reservations", auth, async (req, res) => {
  try {
    const reservations = await Reservation.find(); // Récupère toutes les réservations
    res.render("reservations/list_reservations", {
      title: "Liste des réservations",
      reservations: reservations, // Envoie les données à la vue
    });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération de la liste des réservations");
  }
});

/**
 * @swagger
 * /create_reservations:
 *   get:
 *     summary: Affiche la page de création de réservation
 *     tags: [Index]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vue de la page de création de réservation
 *       500:
 *         description: Erreur lors de la récupération des catways disponibles
 */
router.get("/create_reservations", auth, async (req, res) => {
  try {
    // Récupère les catways disponibles déjà réservés
    const reservedCatways = await Reservation.distinct("catwayNumber");
    // Récupère les catways non réservés
    const availableCatways = await Catway.find(
      { catwayNumber: { $nin: reservedCatways } },
      "catwayNumber type"
    );
    res.render("reservations/create_reservations", {
      title: "Faire une réservation",
      availableCatways, // Envoie les données à la vue
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des catways disponibles",
      error
    );
    res
      .status(500)
      .send("Erreur lors de la récupération des catways disponibles");
  }
});

/**
 * @swagger
 * /reservations/delete_reservations/{id}:
 *   get:
 *     summary: "Annuler une réservation"
 *     tags:
 *       - Index
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID de la réservation à annuler."
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Page de suppression de réservation affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Réservation non trouvée."
 *       500:
 *         description: "Erreur lors de la récupération de la réservation."
 */
router.get("/reservations/delete_reservations/:id", auth, async (req, res) => {
  const reservationId = req.params.id;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }
    res.render("reservations/delete_reservations", {
      title: "Annuler une réservation",
      reservation: reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation", error);
    return res
      .status(500)
      .send("Erreur lors de la récupération de la réservation");
  }
});

/**
 * @swagger
 * /reservations/details_reservation/{id}:
 *   get:
 *     summary: "Voir les détails d'une réservation"
 *     tags:
 *       - Index
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID de la réservation à afficher."
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Page avec les détails de la réservation affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Réservation non trouvée."
 *       500:
 *         description: "Erreur lors de la récupération de la réservation."
 */
router.get("/reservations/details_reservation/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }
    // Convertir `checkIn` et `checkOut` en objets Date si ce sont des chaînes
    if (reservation.checkIn) {
      reservation.checkIn = new Date(reservation.checkIn);
    }
    if (reservation.checkOut) {
      reservation.checkOut = new Date(reservation.checkOut);
    }
    res.render("reservations/details_reservation", { reservation });
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération de la réservation");
  }
});

/**
 * @swagger
 * /list_catways:
 *   get:
 *     summary: "Lister tous les catways"
 *     tags:
 *       - Index
 *     responses:
 *       200:
 *         description: "Liste des catways affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: "Erreur lors de la récupération de la liste des catways."
 */

router.get("/list_catways", auth, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render("catways/list_catways", {
      title: "Liste des catways",
      catways: catways,
    });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération de la liste des catways");
  }
});

/**
 * @swagger
 * /create_catway:
 *   get:
 *     summary: "Enregistrer un catway"
 *     tags:
 *       - Index
 *     responses:
 *       200:
 *         description: "Page de création d'un catway affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: "Erreur lors de la récupération de la page de création."
 */

router.get("/create_catway", auth, async (req, res) => {
  res.render("catways/create_catway", {
    title: "Enregistrer un catway",
  });
});

/**
 * @swagger
 * /catways/update_catway/{id}:
 *   get:
 *     summary: "Mettre à jour un catway"
 *     tags:
 *       - Index
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID du catway à mettre à jour."
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Page de mise à jour du catway affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Catway non trouvé."
 *       500:
 *         description: "Erreur lors de la récupération du catway."
 */

router.get("/catways/update_catway/:id", async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }
    res.render("catways/update_catway", {
      title: "Mise à jour de la description du catway",
      catway: catway,
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération du catway");
  }
});

/**
 * @swagger
 * /catways/delete_catway/{id}:
 *   get:
 *     summary: "Supprimer un catway"
 *     tags:
 *       - Index
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID du catway à supprimer."
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Page de suppression du catway affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Catway non trouvé."
 *       500:
 *         description: "Erreur lors de la récupération du catway."
 */

router.get("/catways/delete_catway/:id", auth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }
    res.render("catways/delete_catway", {
      title: "Supprimer un catway",
      catway: catway,
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération du catway");
  }
});

/**
 * @swagger
 * /catways/details_catway/{id}:
 *   get:
 *     summary: "Voir les détails d'un catway"
 *     tags:
 *       - Index
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID du catway à afficher."
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Page avec les détails du catway affichée."
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: "Catway non trouvé."
 *       500:
 *         description: "Erreur lors de la récupération du catway."
 */

router.get("/catways/details_catway/:id", async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }
    res.render("catways/details_catway", {
      title: "Détails d'un catway",
      catway: catway,
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération du catway");
  }
});

// Autres routes
router.use("/login", authRoute);
router.use("/users", userRoute);
router.use("/catways", catwayRoute);
router.use("/reservations", reservationRoute);

module.exports = router;
