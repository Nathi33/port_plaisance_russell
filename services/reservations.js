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
  const reservationId = req.params.reservationId;
  try {
    let reservation = await Reservations.findById(reservationId);
    if (reservation) {
      return res.status(200).json(reservation);
    }
    return res.status(404).json({ message: "reservation_not_found" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Callback permettant d'ajouter une réservation pour un catway
exports.add = async (req, res, next) => {
  const catwayId = req.params.catwayId;
  try {
    let catway = await Catway.findById(catwayId);
    if (!catway) {
      return res.status(404).json({ message: "catway_not_found " });
    }
    const temp = {
      catwayNumber: catway.catwayNumber,
      clientName: req.body.clientName,
      boatName: req.body.boatName,
      checkIn: req.body.checkIn,
      checkOut: req.body.checkOut,
    };
    let reservation = await Reservations.create(temp);
    return res.status(201).json(reservation);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Callback permettant de supprimer une réservation
exports.delete = async (req, res, next) => {
  const reservationId = req.params.reservationId;
  try {
    let deleteReservation = await Reservations.findByIdAndDelete(reservationId);
    if (deleteReservation) {
      return res.status(204).send();
    }
    return res.status(404).json({ message: "reservation_not_found " });
  } catch (error) {
    return res.status(500).json(error);
  }
};
