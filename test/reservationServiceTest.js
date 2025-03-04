require("dotenv").config();

const assert = require("assert");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const sinon = require("sinon");
const app = require("../app");
const Reservation = require("../models/reservation");
const Catway = require("../models/catway");
const reservationService = require("../services/reservations");

// Test de la fonction add() du service reservations
describe("Test du service de réservation (add)", function () {
  this.timeout(10000);
  let mongoServer;
  before(async function () {
    this.timeout(10000);
    if (process.env.NODE_ENV === "test") {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();

      // Vérifie si Mongoose n'est pas déjà connecté avant de se connecter
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
      }
    }
  });
  after(async function () {
    this.timeout(10000);
    if (process.env.NODE_ENV === "test") {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop(); // Arrêt de mongoServer à la fin des tests
    }
  });
  beforeEach(async function () {
    this.timeout(10000);
    await Catway.deleteMany({});
    await Reservation.deleteMany({});
  });
  it("devrait créer une réservation avec un ID de catway valide", async function () {
    this.timeout(10000);
    const catway = await Catway.create({ catwayNumber: 5000, type: "long" });
    const req = {
      params: { catwayId: catway._id.toString() },
      body: {
        clientName: "John XXX",
        boatName: "Boat Test",
        checkIn: "2025-03-01",
        checkOut: "2025-03-10",
      },
      flash: () => {},
    };
    const res = {
      statusCode: null,
      redirectUrl: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
      redirect: function (url) {
        this.redirectUrl = url;
      },
    };
    await reservationService.add(req, res);
    assert.strictEqual(res.statusCode, 302); // Vérifie la redirection
    assert.strictEqual(res.redirectUrl, "/list_reservations");
    const reservation = await Reservation.findOne({ clientName: "John XXX" });
    assert.ok(reservation);
    assert.strictEqual(reservation.boatName, "Boat Test");
  });
  it("devrait retourner une erreur si l'ID de catway est manquant", async function () {
    this.timeout(10000);
    const req = {
      params: {},
      body: {
        clientName: "Jane Doe",
        boatName: "Boat Boat Test",
        checkIn: "2025-03-01",
        checkOut: "2025-03-10",
      },
      flash: () => {},
    };
    const res = {
      statusCode: null,
      body: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
      redirect: function (url) {
        this.redirectUrl = url;
      },
    };
    await reservationService.add(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.message, "Aucun ID de catway fourni.");
  });
  it("devrait retourner une erreur si le catway n'existe pas", async function () {
    this.timeout(10000);
    const fakeId = new mongoose.Types.ObjectId();
    const req = {
      params: { catwayId: fakeId.toString() },
      body: {
        clientName: "Jane Doe",
        boatName: "Boat Boat Test",
        checkIn: "2025-03-01",
        checkOut: "2025-03-10",
      },
      flash: () => {},
    };
    const res = {
      statusCode: null,
      body: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
      redirect: function (url) {
        this.redirectUrl = url;
      },
    };
    await reservationService.add(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.message, "Catway non trouvé !");
  });
});

// Test de la fonction delete() du service reservations
describe("Test du service de réservation (delete)", function () {
  this.timeout(10000);
  let mongoServer;
  before(async function () {
    this.timeout(10000);
    if (process.env.NODE_ENV === "test") {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
    }
  });
  after(async function () {
    this.timeout(10000);
    if (process.env.NODE_ENV === "test") {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop(); // Arrêt de mongoServer à la fin des tests
    }
  });
  beforeEach(async function () {
    this.timeout(10000);
    await Reservation.deleteMany({});
    await Catway.deleteMany({});
  });
  it("devrait supprimer une réservation avec un ID valide", async function () {
    this.timeout(10000);
    const catway = await Catway.create({ catwayNumber: 5000, type: "long" });
    const reservation = await Reservation.create({
      catwayNumber: catway.catwayNumber,
      clientName: "John Doe",
      boatName: "Sea Explorer",
      checkIn: "2025-03-01",
      checkOut: "2025-03-10",
    });
    const req = {
      params: {
        catwayNumber: catway.catwayNumber,
        reservationId: reservation._id.toString(),
      },
      flash: () => {},
    };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
      redirect: function (url) {
        this.redirectUrl = url;
      },
    };
    await reservationService.delete(req, res);
    assert.strictEqual(res.statusCode, 302, "Le statut HTTP devrait être 302");
    assert.strictEqual(
      res.redirectUrl,
      "/list_reservations",
      "La redirection est incorrecte"
    );
    const deletedReservation = await Reservation.findById(reservation._id);
    assert.strictEqual(
      deletedReservation,
      null,
      "La réservation aurait dû être supprimée"
    );
  });
  it("devrait retourner une erreur si la réservation n'existe pas", async function () {
    this.timeout(10000);
    const req = {
      params: {
        catwayNumber: 5000,
        reservationId: new mongoose.Types.ObjectId().toString(), // ID inexistant
      },
      flash: () => {},
    };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
      redirect: function (url) {
        this.redirectUrl = url;
      },
    };
    await reservationService.delete(req, res);
    assert.strictEqual(res.statusCode, 404, "Le statut HTTP devrait être 404");
    assert.strictEqual(
      res.body.message,
      "reservation_not_found",
      "Le message d'erreur est incorrect"
    );
  });
});

// Test de la fonction getAllByCatway() du service reservations
describe("Test du service de réservation (getAllByCatway)", function () {
  this.timeout(10000);
  let mongoServer;
  before(async function () {
    this.timeout(10000);
    if (process.env.NODE_ENV === "test") {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
    }
  });
  after(async function () {
    this.timeout(10000);
    if (process.env.NODE_ENV === "test") {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop(); // Arrêt de mongoServer à la fin des tests
    }
  });
  beforeEach(async function () {
    this.timeout(10000);
    await Reservation.deleteMany({});
    await Catway.deleteMany({});
  });
  it("devrait retourner toutes les réservations d'un catway existant", async function () {
    this.timeout(10000);
    const catway = await Catway.create({ catwayNumber: 5001, type: "long" });
    await Reservation.create({
      catwayNumber: 5001,
      clientName: "Jean Dupont",
      boatName: "Un bateau",
      checkIn: "2025-03-01",
      checkOut: "2025-03-10",
    });
    const req = { params: { catwayId: catway._id.toString() } };
    const res = {
      statusCode: null,
      body: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };
    await reservationService.getAllByCatway(req, res);
    assert.strictEqual(res.statusCode, 200, "Le statut HTTP devrait être 200");
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].clientName, "Jean Dupont");
  });
  it("devrait retourner une liste vide si aucune réservation n'existe pour le catway", async function () {
    this.timeout(10000);
    const catway = await Catway.create({ catwayNumber: 6000, type: "long" });
    const req = { params: { catwayId: catway._id.toString() } };
    const res = {
      statusCode: null,
      body: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };
    await reservationService.getAllByCatway(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, []);
  });
  it("devrait retourner une erreur 404 si le catway n'existe pas", async function () {
    this.timeout(10000);
    const fakeId = new mongoose.Types.ObjectId();
    const req = { params: { catwayId: fakeId.toString() } }; // ID inexistant
    const res = {
      statusCode: null,
      body: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };
    await reservationService.getAllByCatway(req, res);
    assert.strictEqual(res.statusCode, 404);
    assert.deepStrictEqual(res.body, { message: "catway_not_found" });
  });
});

// Test de la route GET/reservations/details_reservation/:id
describe("GET /reservations/details_reservation/:id", function () {
  let findByIdStub;
  afterEach(() => {
    sinon.restore(); // Nettoie les mocks après chaque test
  });
  it("devrait retourner la réservation si elle existe", async function () {
    const fakeReservation = {
      _id: "123",
      catwayNumber: 5001,
      clientName: "Jean Dupont",
      boatName: "Un bateau",
      checkIn: "2025-03-01",
      checkOut: "2025-03-10",
    };
    // Stub de Reservation.findById pour simuler une réponse réussie
    findByIdStub = sinon
      .stub(Reservation, "findById")
      .resolves(fakeReservation);
    const res = await request(app).get("/reservations/details_reservation/123");
    // Vérifie que la réponse contient le bon status et le bon contenu
    sinon.assert.calledOnce(findByIdStub);
    assert.strictEqual(res.status, 200); // On attend un statut 200
  });
  it("devrait retourner 404 si la réservation n'existe pas", async function () {
    findByIdStub = sinon.stub(Reservation, "findById").resolves(null);
    const res = await request(app).get("/reservations/details_reservation/999");
    sinon.assert.calledOnce(findByIdStub);
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.text, "Réservation non trouvée");
  });
  it("devrait retourner 500 en cas d'erreur serveur", async function () {
    findByIdStub = sinon
      .stub(Reservation, "findById")
      .throws(new Error("Erreur serveur"));
    const res = await request(app).get("/reservations/details_reservation/123");
    sinon.assert.calledOnce(findByIdStub);
    assert.strictEqual(res.status, 500);
    assert.strictEqual(
      res.text,
      "Erreur lors de la récupération de la réservation"
    );
  });
});
