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
 * Route pour afficher la page d'accueil.
 *
 * Cette route affiche la page principale du site avec le titre "Connexion".
 *
 * @route GET /
 * @returns {Object} Vue de la page d'accueil
 */
router.get("/", async (req, res) => {
  res.render("index", { title: "Connexion" });
});

/**
 * Route pour afficher la page d'inscription des membres.
 *
 * Cette route affiche la page d'inscription accessible uniquement par un utilisateur authentifié.
 *
 * @route GET /registration
 * @returns {Object} Vue de la page d'inscription des membres
 */
router.get("/registration", auth, async (req, res) => {
  res.render("users/registration", { title: "Inscription" });
});

/**
 * Route pour afficher la page de mise à jour d'un membre.
 *
 * Cette route permet à un administrateur de mettre à jour les informations d'un membre spécifique.
 * L'utilisateur est récupéré par son ID.
 *
 * @route GET /update/:id
 * @param {string} id - L'ID du membre à mettre à jour.
 * @returns {Object} Vue de la page de mise à jour des informations du membre
 * @throws {Object} 404 - Si l'utilisateur n'est pas trouvé.
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
 * Route pour afficher la page de suppression d'un membre.
 *
 * Cette route permet de supprimer un membre du système.
 * L'utilisateur authentifié est récupéré et passé à la vue pour confirmation.
 *
 * @route GET /delete_member
 * @returns {Object} Vue de la page de suppression d'un membre
 * @throws {Object} 404 - Si l'utilisateur n'est pas trouvé
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
 * Route pour afficher la liste des réservations.
 *
 * Cette route récupère toutes les réservations et les affiche dans une vue.
 *
 * @route GET /list_reservations
 * @returns {Object} Vue de la liste des réservations
 * @throws {Object} 500 - Si une erreur survient lors de la récupération des réservations
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
 * Route pour afficher la page de création de réservation.
 *
 * Cette route permet à l'utilisateur d'effectuer une nouvelle réservation en affichant
 * les catways disponibles.
 *
 * @route GET /create_reservations
 * @returns {Object} Vue de la page de création de réservation avec les catways disponibles
 * @throws {Object} 500 - Si une erreur survient lors de la récupération des catways disponibles
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
 * Route pour afficher la page de suppression d'une réservation.
 *
 * Cette route permet à un utilisateur d'annuler une réservation existante.
 *
 * @route GET /reservations/delete_reservations/:id
 * @param {string} id - L'ID de la réservation à annuler.
 * @returns {Object} Vue de la page de suppression de réservation
 * @throws {Object} 404 - Si la réservation n'est pas trouvée
 * @throws {Object} 500 - En cas d'erreur serveur
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
 * Route pour afficher les détails d'une réservation.
 *
 * Cette route permet d'afficher les détails complets d'une réservation à partir de son ID.
 *
 * @route GET /reservations/details_reservation/:id
 * @param {string} id - L'ID de la réservation à afficher.
 * @returns {Object} Vue des détails de la réservation
 * @throws {Object} 404 - Si la réservation n'est pas trouvée
 * @throws {Object} 500 - En cas d'erreur serveur
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
 * Route pour afficher la liste des catways.
 *
 * Cette route récupère et affiche tous les catways dans la vue.
 *
 * @route GET /list_catways
 * @returns {Object} Vue de la liste des catways
 * @throws {Object} 500 - En cas d'erreur lors de la récupération des catways
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
 * @route GET /create_catway
 * @desc Affiche le formulaire pour enregistrer un nouveau catway.
 * @access Protéger (requiert une authentification)
 */
router.get("/create_catway", auth, async (req, res) => {
  res.render("catways/create_catway", {
    title: "Enregistrer un catway",
  });
});

/**
 * @route GET /catways/update_catway/:id
 * @desc Affiche le formulaire pour mettre à jour un catway existant.
 * @param {string} id - L'ID du catway à mettre à jour
 * @access Public
 * @throws {404} Si le catway n'est pas trouvé
 * @throws {500} En cas d'erreur serveur lors de la récupération du catway
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
 * @route GET /catways/delete_catway/:id
 * @desc Affiche la page de confirmation pour supprimer un catway.
 * @param {string} id - L'ID du catway à supprimer
 * @access Protéger (requiert une authentification)
 * @throws {404} Si le catway n'est pas trouvé
 * @throws {500} En cas d'erreur serveur lors de la récupération du catway
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
 * @route GET /catways/details_catway/:id
 * @desc Affiche les détails d'un catway spécifique.
 * @param {string} id - L'ID du catway dont afficher les détails
 * @access Public
 * @throws {404} Si le catway n'est pas trouvé
 * @throws {500} En cas d'erreur serveur lors de la récupération du catway
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
