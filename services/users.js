const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @function
 * @description Récupère un utilisateur par son ID.
 * @route GET /users/:id
 * @param {string} req.params.id - L'ID de l'utilisateur à récupérer.
 * @returns {Object} Détails de l'utilisateur si trouvé.
 * @returns {string} Message d'erreur si l'utilisateur n'est pas trouvé.
 */
exports.getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    let user = await User.findById(id);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json("user_not_found");
  } catch (error) {
    return res.status(501).json(error);
  }
};

/**
 * @function
 * @description Ajoute un nouvel utilisateur.
 * @route POST /users
 * @param {Object} req.body - Données de l'utilisateur à ajouter.
 * @param {string} req.body.name - Le nom de l'utilisateur.
 * @param {string} req.body.firstname - Le prénom de l'utilisateur.
 * @param {string} req.body.email - L'email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur.
 * @returns {Object} Message de succès ou d'erreur après l'ajout.
 */
exports.add = async (req, res, next) => {
  try {
    const { name, firstname, email, password } = req.body;
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Cet utilisateur existe déjà !");
      return res.redirect("/registration");
      // return res.status(400).json({ message: "Cet utilisateur existe déjà !" });
    }
    // Création du nouvel utilisateur
    const newUser = new User({
      name,
      firstname,
      email,
      password, // Le mot de passe sera haché automatiquement par le middleware bcrypt
    });
    await newUser.save();
    req.flash("success", "L'utilisateur a été créé avec succès !");
    res.redirect("/registration");
    // res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    req.flash("error", "Erreur lors de la création de l'utilisateur !");
    res.redirect("/registration");
    // res
    //   .status(500)
    //   .json({ message: "Erreur lors de la création de l'utilisateur !" });
  }
};

/**
 * @function
 * @description Modifie un utilisateur existant.
 * @route PUT /users/:id
 * @param {string} req.params.id - L'ID de l'utilisateur à modifier.
 * @param {Object} req.body - Données de l'utilisateur à mettre à jour.
 * @param {string} req.body.name - Le nom de l'utilisateur.
 * @param {string} req.body.firstname - Le prénom de l'utilisateur.
 * @param {string} req.body.email - L'email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur.
 * @returns {Object} Message de succès ou d'erreur après la mise à jour.
 */
exports.update = async (req, res, next) => {
  const id = req.params.id;
  const temp = {
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    let user = await User.findOne({ _id: id });
    if (user) {
      Object.keys(temp).forEach((key) => {
        if (!!temp[key]) {
          user[key] = temp[key];
        }
      });
      await user.save();
      req.flash("successMessage", "Mise à jour réussie !");
      return res.redirect("/dashboard");
    }
    req.flash("errorMessage", "Utilisateur non trouvé !");
    return res.redirect("/dashboard");
  } catch (error) {
    req.flash("errorMessage", "Erreur lors de la mise à jour !");
    return res.redirect("/dashboard");
  }
};

/**
 * @function
 * @description Supprime un utilisateur.
 * @route DELETE /users/:id
 * @param {string} req.params.id - L'ID de l'utilisateur à supprimer.
 * @returns {Object} Message de succès ou d'erreur après la suppression.
 */
exports.delete = async (req, res, next) => {
  const id = req.params.id;
  // Vérifie que l'utilisateur connecté est bien celui qui tente de supprimer le profil
  if (req.user.userId !== id) {
    req.flash(
      "errorMessage",
      "Vous n'êtes pas autorisé à supprimer ce profil !"
    );
    return res.redirect("/dashboard");
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      req.flash("errorMessage", "Utilisateur introuvable !");
      return res.redirect("/dashboard");
    }
    req.flash("successMessage", "Utilisateur supprimé avec succès !");
    return res.redirect("/login");
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    req.flash("errorMessage", "Erreur lors de la suppression du profil !");
    return res.redirect("/dashboard");
  }
};

/**
 * @function
 * @description Authentifie un utilisateur.
 * @route POST /users/authenticate
 * @param {Object} req.body - Données pour l'authentification.
 * @param {string} req.body.email - L'email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur.
 * @returns {string} Token JWT si l'authentification est réussie.
 * @returns {string} Message d'erreur si l'utilisateur ou le mot de passe est incorrect.
 */
exports.authenticate = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(403).json({ message: "Mot de passe incorrect" });
    // Génération du token JWT
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );
    res.status(200).json({ token }); // Renvoie le token au client
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
