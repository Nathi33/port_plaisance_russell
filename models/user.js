const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/**
 * @typedef {Object} User
 * @property {string} name - Le nom de l'utilisateur.
 * @property {string} firstname - Le prénom de l'utilisateur (optionnel).
 * @property {string} email - L'email de l'utilisateur (doit être unique et en minuscule).
 * @property {string} password - Le mot de passe de l'utilisateur (doit être haché avant d'être stocké).
 * @property {Date} createdAt - La date de création du profil utilisateur.
 * @property {Date} updatedAt - La date de la dernière mise à jour du profil utilisateur.
 */

/**
 * Schéma représentant un utilisateur dans la base de données.
 * Le schéma inclut des informations de base sur l'utilisateur telles que le nom, prénom, email et mot de passe.
 * Le mot de passe est automatiquement haché avant d'être enregistré.
 *
 * @type {Schema}
 */
const User = new Schema(
  {
    /**
     * Le nom de l'utilisateur.
     * Ce champ est requis et doit être une chaîne de caractères.
     *
     * @type {string}
     * @required
     */
    name: {
      type: String,
      trim: true,
      required: [true, "Le nom est requis"],
    },

    /**
     * Le prénom de l'utilisateur (facultatif).
     * Ce champ est une chaîne de caractères.
     *
     * @type {string}
     */
    firstname: {
      type: String,
      trim: true,
    },

    /**
     * L'email de l'utilisateur.
     * Ce champ est requis, unique et converti en minuscule avant d'être enregistré.
     *
     * @type {string}
     * @required
     * @unique
     */
    email: {
      type: String,
      trim: true,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
    },

    /**
     * Le mot de passe de l'utilisateur.
     * Ce champ est requis et doit être une chaîne de caractères.
     * Il sera automatiquement haché avant d'être stocké dans la base de données.
     *
     * @type {string}
     * @required
     */
    password: {
      type: String,
      trim: true,
      required: [true, "Le mot de passe est requis"],
    },
  },
  {
    /**
     * Ajouter les champs createdAt et updatedAt automatiquement.
     * Ces champs seront utilisés pour suivre les dates de création et de mise à jour du profil utilisateur.
     *
     * @type {object}
     */
    timestamps: true,
  }
);

/**
 * Middleware exécuté avant l'enregistrement d'un utilisateur.
 * Si le mot de passe est modifié, il sera haché avec bcrypt avant d'être sauvegardé dans la base de données.
 *
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 












 * @function
 * @name hashPassword
 */
User.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("User", User);
