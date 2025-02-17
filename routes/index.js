const express = require("express");
const router = express.Router();

const userRoute = require("../routes/users");
const catwayRoute = require("../routes/catways");
const reservationRoute = require("../routes/reservations");
const authRoute = require("../routes/auth");

const Catway = require("../models/catway");
const Reservation = require("../models/reservation");

// Route pour la page d'accueil
router.get("/", async (req, res) => {
  res.render("index", { title: "Connexion" });
});

// Route pour les pages des membres
router.get("/registration", async (req, res) => {
  res.render("users/registration", { title: "Inscription" });
});
router.get("/update_member", async (req, res) => {
  res.render("users/update_member", { title: "Mise à jour d'un membre" });
});
router.get("/delete_member", async (req, res) => {
  res.render("users/delete_member", { title: "Suppression d'un membre" });
});

// Route pour les pages de réservations
router.get("/list_reservations", async (req, res) => {
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

router.get("/create_reservations", async (req, res) => {
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

router.get("/reservations/delete_reservations/:id", async (req, res) => {
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

router.get("/reservations/details_reservation/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id); // Récupère le catway par son id
    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }
    res.render("reservations/details_reservation", {
      title: "Détails de la réservation",
      reservation: reservation,
    });
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération de la réservation");
  }
});

// Route pour les pages des catways
router.get("/list_catways", async (req, res) => {
  try {
    const catways = await Catway.find(); // Récupère tous les catways
    res.render("catways/list_catways", {
      title: "Liste des catways",
      catways: catways, // Envoie les données à la vue
    });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération de la liste des catways");
  }
});

router.get("/create_catway", async (req, res) => {
  res.render("catways/create_catway", {
    title: "Enregistrer un catway",
  });
});

router.get("/catways/update_catway/:id", async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id); // Récupère le catway par son id
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

router.get("/catways/delete_catway/:id", async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id); // Récupère le catway par son id
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

router.get("/catways/details_catway/:id", async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id); // Récupère le catway par son id
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
