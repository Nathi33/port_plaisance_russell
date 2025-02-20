const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const SECRET_KEY = process.env.SECRET_KEY;

// Callback servant à ajouter un user avec son id
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

// Callback servant à ajouter un user
exports.add = async (req, res, next) => {
  try {
    const { name, firstname, email, password } = req.body;
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Cet utilisateur existe déjà !");
      return res.redirect("/registration");
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
  } catch (error) {
    req.flash("error", "Erreur lors de la création de l'utilisateur !");
    res.redirect("/registration");
  }
};

// Callback servant à modifier un user
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

// Callback servant à supprimer un user
exports.delete = async (req, res, next) => {
  // Récupère l'id de l'utilisateur connecté
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

// Callback servant à authentifier un user
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

    console.log("Token généré :", token); // 🔍 Vérifie si le token est bien généré
    res.status(200).json({ token }); // Renvoie le token au client
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
