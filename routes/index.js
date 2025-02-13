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

router.use("/login", authRoute);
router.use("/users", userRoute);
router.use("/catways", catwayRoute);
router.use("/reservations", reservationRoute);

module.exports = router;
