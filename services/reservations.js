const Reservations = require("../models/reservation");
const Catway = require("../models/catway");

// Callback permettant de récupérer toutes les réservations pour un catway spécifique
exports.getAllByCatway = async (req, res, next) => {
  const catwayId = req.params.catwayId;
  try {
    let catway = await Catway.findById(catwayId);
    if (!catway) {
      return res.status(404).json({ message: "catway_not_found" });
    }
    let reservations = await Reservations.find({
      catwayNumber: catway.catwayNumber,
    });
    return res.status(200).json(reservations);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Callback permettant de récupérer une réservation spécifique pour un catway
exports.getById = async (req, res, next) => {
  const { reservationId, catwayNumber } = req.params;
  try {
    const reservation = await Reservations.findOne({
      _id: reservationId,
      catwayNumber: catwayNumber,
    });
    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }
    res.render("reservations/delete_reservations", {
      title: "Annuler une réservation",
      reservation: reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation", error);
    return res.status(500).json(error);
  }
};

// Callback permettant d'ajouter une réservation pour un catway
exports.add = async (req, res, next) => {
  // Récupère l'ID depuis l'URL ou le corps de la requête si l'ID n'est pas dans l'URL
  const catwayId = req.params.catwayId || req.body.catwayNumber;
  if (!catwayId) {
    return res.status(400).json({ message: "Aucun ID de catway fourni." });
  }
  try {
    let catway = await Catway.findById(catwayId);
    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé !" });
    }
    const temp = {
      catwayNumber: catway.catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
    };
    let reservation = await Reservations.create(temp);
    req.flash("success", "La réservation a été créée avec succès !");
    return res.redirect("/list_reservations");
  } catch (error) {
    console.error("Erreur lors de la création de la réservation", error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la création de la réservation"
    );
    return res.redirect("/create_reservation");
  }
};

// Callback permettant de supprimer une réservation
exports.delete = async (req, res, next) => {
  const { catwayNumber, reservationId } = req.params;
  try {
    const reservation = await Reservations.findOne({
      _id: reservationId,
      catwayNumber: catwayNumber,
    });
    if (!reservation) {
      return res.status(404).json({ message: "reservation_not_found" });
    }

    await Reservations.findByIdAndDelete(reservationId);
    req.flash("success", "Réservation supprimée avec succès !");
    return res.redirect("/list_reservations");
  } catch (error) {
    console.error("Erreur suppression réservation", error);
    req.flash("error", "Erreur lors de la suppression de la réservation");
    return res.redirect("/list_reservations");
  }
};
