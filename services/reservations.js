const Reservations = require("../models/reservation");
const Catway = require("../models/catway");

/**
 * @function
 * @description Récupère toutes les réservations pour un catway spécifique.
 * @route GET /catways/:catwayId/reservations
 * @param {string} req.params.catwayId - L'ID du catway pour lequel récupérer les réservations.
 * @returns {Array} Liste des réservations associées au catway.
 * @returns {string} Message d'erreur si le catway n'est pas trouvé.
 */
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

/**
 * @function
 * @description Récupère une réservation spécifique pour un catway.
 * @route GET /catways/:catwayNumber/reservations/:reservationId
 * @param {string} req.params.reservationId - L'ID de la réservation à récupérer.
 * @param {string} req.params.catwayNumber - Le numéro du catway associé à la réservation.
 * @returns {Object} Détails de la réservation si trouvée.
 * @returns {string} Message d'erreur si la réservation n'est pas trouvée.
 */
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

/**
 * @function
 * @description Ajoute une nouvelle réservation pour un catway.
 * @route POST /catways/:catwayId/reservations
 * @param {string} req.params.catwayId - L'ID du catway pour lequel ajouter une réservation.
 * @param {Object} req.body - Données de la réservation à créer.
 * @param {string} req.body.clientName - Le nom du client.
 * @param {string} req.body.boatName - Le nom du bateau.
 * @param {Date} req.body.checkIn - La date d'arrivée.
 * @param {Date} req.body.checkOut - La date de départ.
 * @returns {Object} Message de succès ou d'erreur après l'ajout de la réservation.
 */
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
    res.status(302);
    return res.redirect("/list_reservations");
  } catch (error) {
    console.error("Erreur lors de la création de la réservation", error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la création de la réservation"
    );
    res.status(500);
    return res.redirect("/create_reservation");
  }
};

/**
 * @function
 * @description Supprime une réservation spécifiée pour un catway.
 * @route DELETE /catways/:catwayNumber/reservations/:reservationId
 * @param {string} req.params.catwayNumber - Le numéro du catway associé à la réservation.
 * @param {string} req.params.reservationId - L'ID de la réservation à supprimer.
 * @returns {Object} Message de succès si la réservation a été supprimée.
 * @returns {string} Message d'erreur si la réservation n'est pas trouvée.
 */
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
    res.status(302).redirect("/list_reservations");
  } catch (error) {
    console.error("Erreur suppression réservation", error);
    req.flash("error", "Erreur lors de la suppression de la réservation");
    return res.redirect("/list_reservations");
  }
};
