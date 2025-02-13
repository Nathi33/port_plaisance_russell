const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const mongodb = require("./db/mongo");

const User = require("./models/user");

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

// Ajout du répertoire views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configuration de la session
app.use(
  session({
    secret: "monSecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Configuration de la route d'authentification
app.use("/auth", authRouter);

// Configuration de la route principale avec pour url de base "/"
app.use("/", indexRouter);

// Configuration de la route pour accéder au dashboard
app.use("/dashboard", dashboardRouter);

// Retour en cas de requête sur une route inexistante
app.use(function (req, res, next) {
  res.status(404).json({
    name: "API_RUSSELL",
    version: "1.0",
    status: 404,
    message: "Not Found",
  });
});

module.exports = app;
