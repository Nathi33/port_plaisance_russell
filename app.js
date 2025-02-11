const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const mongodb = require("./db/mongo");

// Initialisation de la connexion à la base de données MongoDB
mongodb.initClientDbConnection();

const app = express();

// Configuration des CORS en acceptant toutes les origines et on récupère le token d'authentification côté client
app.use(
  cors({
    exposedHeaders: ["Authorization"],
    origin: "*",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configuration de la route principale avec pour url de base "/"
app.use("/", indexRouter);

// Retour en cas de requête sur une route inexistante
app.use(function (req, res, next) {
  res
    .status(404)
    .json({
      name: "API_RUSSELL",
      version: "1.0",
      status: 404,
      message: "Not Found",
    });
});

module.exports = app;
