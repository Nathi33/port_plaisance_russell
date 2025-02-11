const express = require("express");
const router = express.Router();

const userRoute = require("../routes/users");
const catwayRoute = require("../routes/catways");
const reservationRoute = require("../routes/reservations");

/* GET home page. */
router.get("/", async (req, res) => {
  res.status(200).json({
    name: "API_RUSSELL",
    version: "1.0",
    status: 200,
    message: "Bienvenue sur l'API du Port de Plaisance RUSSELL",
  });
});

router.use("/users", userRoute);
router.use("/catways", catwayRoute);
router.use("/reservations", reservationRoute);

module.exports = router;
