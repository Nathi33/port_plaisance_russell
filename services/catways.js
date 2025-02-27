const Catway = require("../models/catway");

/**
 * @function
 * @description Récupère tous les catways depuis la base de données.
 * @route GET /catways
 * @returns {Array} Liste des catways.
 */
exports.getAll = async (req, res, next) => {
  try {
    let catways = await Catway.find();
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * @function
 * @description Récupère un catway spécifique par son identifiant.
 * @route GET /catways/:id
 * @param {string} req.params.id - L'ID du catway à récupérer.
 * @returns {Object} Détails du catway si trouvé.
 * @returns {string} Message d'erreur si catway non trouvé.
 */
exports.getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    let catway = await Catway.findById(id);
    if (catway) {
      return res.status(200).json(catway);
    }
    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * @function
 * @description Ajoute un nouveau catway à la base de données.
 * @route POST /catways
 * @param {Object} req.body - Données du catway à ajouter.
 * @param {string} req.body.catwayNumber - Le numéro du catway.
 * @param {string} req.body.type - Le type de catway.
 * @param {string} req.body.catwayState - L'état du catway.
 * @returns {Object} Message de succès ou d'erreur après l'ajout.
 */
exports.add = async (req, res, next) => {
  const temp = {
    catwayNumber: req.body.catwayNumber,
    type: req.body.type,
    catwayState: req.body.catwayState,
  };
  try {
    await Catway.create(temp);
    req.flash("success", "Le catway a été ajouté avec succès !");
    return res.redirect("/create_catway");
  } catch (error) {
    req.flash("error", "Une erreur s'est produite lors de l'ajout du catway");
    return res.redirect("/create_catway");
  }
};

/**
 * @function
 * @description Met à jour les informations d'un catway spécifié par son identifiant.
 * @route PUT /catways/:id
 * @param {string} req.params.id - L'ID du catway à mettre à jour.
 * @param {Object} req.body - Données à mettre à jour.
 * @param {string} req.body.catwayState - L'état du catway à mettre à jour.
 * @returns {Object} Le catway mis à jour.
 * @returns {string} Message d'erreur si le catway n'est pas trouvé.
 */
exports.update = async (req, res, next) => {
  try {
    const updatedCatway = await Catway.findByIdAndUpdate(
      req.params.id,
      { catwayState: req.body.catwayState },
      { new: true } // Renvoie le catway mis à jour et remplace l'ancien
    );
    // Si le catway n'est pas trouvé
    if (!updatedCatway) {
      req.flash("error", "Catway non trouvé !");
      return res.status(404).json({ message: "Catway non trouvé" });
    }
    // Redirection si le catway est trouvé et mis à jour
    req.flash(
      "success",
      "La description du catway a été mise à jour avec succès !"
    );
    return res.redirect(`/catways/details_catway/${req.params.id}`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la mise à jour du catway !"
    );
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

/**
 * @function
 * @description Met à jour partiellement un catway spécifié par son identifiant.
 * @route PATCH /catways/:id
 * @param {string} req.params.id - L'ID du catway à mettre à jour partiellement.
 * @param {Object} req.body - Données à mettre à jour partiellement.
 * @returns {Object} Le catway mis à jour.
 * @returns {string} Message d'erreur si catway non trouvé.
 */
exports.partialUpdate = async (req, res, next) => {
  const id = req.params.id;
  try {
    let catway = await Catway.findByIdAndUpdate(id, req.body, { new: true });
    if (catway) {
      return res.status(200).json(catway);
    }
    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(500).json(error);
  }
};

/**
 * @function
 * @description Supprime un catway spécifié par son identifiant.
 * @route DELETE /catways/:id
 * @param {string} req.params.id - L'ID du catway à supprimer.
 * @returns {string} Message de succès si le catway a été supprimé.
 * @returns {string} Message d'erreur si le catway n'est pas trouvé.
 */
exports.delete = async (req, res, next) => {
  const id = req.params.id;
  try {
    let deletedCatway = await Catway.findByIdAndDelete(id);
    if (deletedCatway) {
      req.flash("success", "Le catway a été supprimé avec succès !");
      return res.redirect("/list_catways");
    }
    // Si le catway n'est pas trouvé
    return res.status(404).json({ error: "catway_not_found" });
  } catch (error) {
    console.error("Erreur lors de la suppression : ", error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la suppression du catway"
    );
    return res.redirect("/delete_catway");
  }
};
