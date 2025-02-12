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
    let catway = await Catway.create(temp);
    return res.status(201).json(catway);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Callback permettant de mettre à jour un catway (PUT)
exports.update = async (req, res, next) => {
  const id = req.params.id;
  const temp = {
    catwayNumber: req.body.catwayNumber,
    type: req.body.type,
    catwayState: req.body.catwayState,
  };
  try {
    let catway = await Catway.findById(id);
    if (catway) {
      Object.keys(temp).forEach((key) => {
        if (!!temp[key]) {
          catway[key] = temp[key];
        }
      });
      await catway.save();
      return res.status(200).json(catway);
    }
    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(500).json(error);
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
      return res.status(204).send();
    }
    return res.status(404).json("catway_not_found");
  } catch (error) {
    return res.status(500).json(error);
  }
};
