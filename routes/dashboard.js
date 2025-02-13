const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

// Route protégée pour afficher le dashboard
router.get("/", auth, async (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

module.exports = router;
