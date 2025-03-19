const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const path = require("path");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const mongodb = require("./db/mongo");
const catwayRoutes = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");
const usersRoutes = require("./routes/users");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger"); // Importation de Swagger

console.log("Swagger Docs available at http://localhost:3000/api-docs");

// Initialisation de la connexion à la base de données MongoDB
mongodb.initClientDbConnection();

const app = express();
swaggerDocs(app); // Initialisation de Swagger

// Configuration des CORS en acceptant toutes les origines et on récupère le token d'authentification côté client
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Autorise les cookies et le header Authorization
    exposedHeaders: ["Authorization"], // Expose le header Authorization
  })
);

app.use(logger("dev"));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permet de récupérer les données d'un formulaire
app.use(cookieParser());
app.use("/docs", express.static("docs"));

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

// Configuration du middleware flash
app.use(flash());

// Middleware pour rendre les messages flash accessibles dans les templates
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});

// Configuration de la route d'authentification
app.use("/auth", authRouter);

// Configuration de la route principale avec pour url de base "/"
app.use("/", indexRouter);

// Configuration de la route pour accéder au dashboard
app.use("/dashboard", dashboardRouter);

// Configuration de la route pour accéder aux catways
app.use("/catways", catwayRoutes);

// Configuration de la route pour accéder aux réservations
app.use("/catways", reservationRoutes);

// Configuration de la route pour accéder aux utilisateurs
app.use("/users", usersRoutes);

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
