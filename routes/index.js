const express = require("express");
const router = express.Router();

const userRoute = require("../routes/users");
const catwayRoute = require("../routes/catways");
const reservationRoute = require("../routes/reservations");
const authRoute = require("../routes/auth");

// Route pour la page d'accueil
router.get("/", async (req, res) => {
  res.render("index", { title: "Connexion" });
});

// Route pour les pages des membres
router.get("/registration", async (req, res) => {
  res.render("registration", { title: "Inscription" });
});
router.get("/update_member", async (req, res) => {
  res.render("update_member", { title: "Mise à jour d'un membre" });
});
router.get("/delete_member", async (req, res) => {
  res.render("delete_member", { title: "Suppression d'un membre" });
});

// Route pour les pages de réservations
router.get("/list_reservations", async (req, res) => {
  res.render("list_reservations", { title: "Liste des réservations" });
});
router.get("/create_reservations", async (req, res) => {
  res.render("create_reservations", { title: "Faire une réservation" });
});
router.get("/delete_reservations", async (req, res) => {
  res.render("delete_reservations", { title: "Annuler une réservation" });
});

// Route pour les pages des catways
router.get("/list_catways", async (req, res) => {
  res.render("list_catways", { title: "Liste des catways" });
});
router.get("/create_catway", async (req, res) => {
  res.render("create_catway", { title: "Enregistrer un catway" });
});
router.get("/update_catway", async (req, res) => {
  res.render("update_catway", {
    title: "Mise à jour de la description du catway",
  });
});
router.get("/delete_catway", async (req, res) => {
  res.render("delete_catway", { title: "Supprimer un catway" });
});

// Autres routes
router.use("/login", authRoute);
router.use("/users", userRoute);
router.use("/catways", catwayRoute);
router.use("/reservations", reservationRoute);

module.exports = router;
