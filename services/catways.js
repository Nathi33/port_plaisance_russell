const Catway = require("../models/catway");

// Callback récupérant tous les catways
exports.getAll = async (req, res, next) => {
  try {
    let catways = await Catway.find();
    return res.status(200).json(catways);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Callback récupérant un catway par son Id
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

// Callback permettant l'ajout d'un catway
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

// Callback permettant de mettre à jour un catway (PUT)
exports.update = async (req, res, next) => {
  try {
    const updatedCatway = await Catway.findByIdAndUpdate(
      req.params.id, // Récupère l'id du catway à modifier
      { catwayState: req.body.catwayState }, // Met à jour le champ catwayState
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

// Callback permettant de mettre à jour partiellement un catway (PATCH)
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

//Callback permettant de supprimer un catway
exports.delete = async (req, res, next) => {
  const id = req.params.id;
  try {
    let deletedCatway = await Catway.findByIdAndDelete(id);
    if (deletedCatway) {
      req.flash("success", "Le catway a été supprimé avec succès !");
      return res.redirect("/list_catways");
    }
    return res.status(404).json({ error: "catway_not_found" });
  } catch (error) {
    console.error("Erreur lors de la suppression : ", error);
    req.flash("error", "Une erreur s'est produite lors de l'ajout du catway");
    return res.redirect("/delete_catway");
  }
};
