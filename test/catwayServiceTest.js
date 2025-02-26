const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway");
const { add } = require("../services/catways");
const { getAll } = require("../services/catways");
const { getById } = require("../services/catways");
const { update } = require("../services/catways");
const { delete: deleteCatway } = require("../services/catways");
const catways = require("../services/catways");

// Test de la fonction add() du service catways
describe("catways", function () {
  describe("add()", function () {
    let req, res, next;
    this.beforeEach(() => {
      // Création d'un mock pour req, res et next
      req = {
        body: {
          catwayNumber: 1000,
          type: "short",
          catwayState: "description ok",
        },
        flash: function (type, message) {
          this.flashMessage = { type, message };
        },
      };
      res = {
        redirect: function (url) {
          this.redirectUrl = url;
        },
      };
      next = function () {};
    });
    it("devrait ajouter un catway et rediriger avec succès", async function () {
      // "Mock" de la méthode Catway.create
      const originalCreate = Catway.create; // Sauvegarde de la méthode originale
      Catway.create = function () {
        return Promise.resolve(); // Simule un ajout réussi
      };
      await add(req, res, next);
      // Vérifie que le message flash a été correctement envoyé
      assert.strictEqual(req.flashMessage.type, "success");
      assert.strictEqual(
        req.flashMessage.message,
        "Le catway a été ajouté avec succès !"
      );
      // Vérifie que la redirection a été correctement effectuée
      assert.strictEqual(res.redirectUrl, "/create_catway");
      // Restaure la méthode originale après le test
      Catway.create = originalCreate;
    });
    it("devrait redirigé avec une erreur si l'ajout échoue", async function () {
      // "Mock" de la méthode Catway.create pour simuler une erreur
      const originalCreate = Catway.create;
      Catway.create = function () {
        return Promise.reject(new Error("Erreur de création")); // Simule une erreur
      };
      await add(req, res, next);
      // Vérifie que le message flash d'erreur a été correctement envoyé
      assert.strictEqual(req.flashMessage.type, "error");
      assert.strictEqual(
        req.flashMessage.message,
        "Une erreur s'est produite lors de l'ajout du catway"
      );
      // Vérifie que la redirection a été correctement effectuée
      assert.strictEqual(res.redirectUrl, "/create_catway");
      // Restaure la méthode originale après le test
      Catway.create = originalCreate;
    });
  });
});

// Test de la fonction getAll() du service catways
describe("catways", function () {
  describe("getAll()", function () {
    let req, res, next;
    beforeEach(() => {
      // Création d'un mock pour req, res et next
      req = {};
      res = {
        status: function (code) {
          this.statusCode = code;
          return this; // Permet les appels en chaîne
        },
        json: function (data) {
          this.jsonData = data;
        },
      };
      next = function () {};
    });
    it("devrait récupérer tous les catways avec succès", async function () {
      // "Mock" de la méthode Catway.find() pour simuler un succès
      const originalFind = Catway.find; // Sauvegarde de la méthode originale
      Catway.find = function () {
        return Promise.resolve([
          {
            catwayNumber: 1001,
            type: "long",
            catwayState: "Description encore ok",
          },
        ]);
      };
      await getAll(req, res, next);
      // Vérifie que la méthode Catway.find a bien été appelée
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.jsonData, [
        {
          catwayNumber: 1001,
          type: "long",
          catwayState: "Description encore ok",
        },
      ]);
      // Restaure la méthode originale après le test
      Catway.find = originalFind;
    });
    it("devrait renvoyer une erreur si la récupération échoue", async function () {
      // "Mock" de la méthode Catway.find() pour simuler une erreur
      const originalFind = Catway.find;
      Catway.find = function () {
        return Promise.reject(
          new Error("Erreur lors de la récupération des catways")
        );
      };
      await getAll(req, res, next);
      // Vérifie que le statut 500 et l'erreur ont bien été renvoyés
      assert.strictEqual(res.statusCode, 500);
      assert.strictEqual(
        res.jsonData.message,
        "Erreur lors de la récupération des catways"
      );
      // Restaure la méthode originale après le test
      Catway.find = originalFind;
    });
  });
});

// Test de la fonction getById() du service catways
describe("catways", function () {
  describe("getById()", function () {
    let req, res, next;
    beforeEach(() => {
      // Création d'un mock pour req, res et next
      req = {
        params: {
          id: "1002", // ID fictif pour les tests
        },
      };
      res = {
        status: function (code) {
          this.statusCode = code;
          return this; // Permet de chaîner les appels
        },
        json: function (data) {
          this.jsonData = data;
        },
      };
      next = function () {};
    });
    it("devrait récupérer un catway avec succès", async function () {
      // "Mock" de la méthode Catway.findById() pour simuler un succès
      const originalFindById = Catway.findById; // Sauvegarde de la méthode originale
      Catway.findById = function (id) {
        // Simule la récupération d'un catway avec l'ID
        if (id === "1002") {
          return Promise.resolve({
            catwayNumber: 1002,
            type: "short",
            catwayState: "Description toujours ok",
          });
        }
        return Promise.resolve(null); // Cas où l'ID n'existe pas
      };
      await getById(req, res, next);
      // Vérifie que la méthode Catway.findById a bien été appelée et que la réponse contient les données du catway
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.jsonData, {
        catwayNumber: 1002,
        type: "short",
        catwayState: "Description toujours ok",
      });
      // Restaure la méthode originale après le test
      Catway.findById = originalFindById;
    });
    it("devrait retourner une erreur 404 si le catway n'est pas trouvé", async function () {
      // "Mock" de la méthode Catway.findById() pour simuler un catway non trouvé
      const originalFindById = Catway.findById;
      Catway.findById = function (id) {
        return Promise.resolve(null); // Aucun catway trouvé pour cet ID
      };
      await getById(req, res, next);
      // Vérifie que le statut est bien 404 et le message est correct
      assert.strictEqual(res.statusCode, 404);
      assert.strictEqual(res.jsonData, "catway_not_found");
      // Restaure la méthode originale après le test
      Catway.findById = originalFindById;
    });
    it("devrait renvoyer une erreur 500 si une erreur se produit lors de la récupération", async function () {
      // "Mock" de la méthode Catway.findById() pour simuler une erreur
      const originalFindById = Catway.findById;
      Catway.findById = function (id) {
        return Promise.reject(
          new Error("Erreur lors de la récupération du catway")
        );
      };
      await getById(req, res, next);
      // Vérifie que le statut est bien 500 et l'erreur est renvoyée
      assert.strictEqual(res.statusCode, 500);
      assert.strictEqual(
        res.jsonData.message,
        "Erreur lors de la récupération du catway"
      );
      // Restaure la méthode originale après le test
      Catway.findById = originalFindById;
    });
  });
});

// Test de la fonction update() du service catways
describe("catways", function () {
  describe("update()", function () {
    let findByIdAndUpdateStub;

    beforeEach(() => {
      findByIdAndUpdateStub = sinon.stub(Catway, "findByIdAndUpdate");
    });

    afterEach(() => {
      sinon.restore(); // Toujours restaurer les mocks après chaque test
    });

    it("devrait mettre à jour un catway avec succès", async function () {
      // Simule un catway mis à jour
      const fakeCatway = { _id: "fakeId", catwayState: "NouveauStatut" };
      findByIdAndUpdateStub.resolves(fakeCatway);

      // Simule une requête et une réponse
      const req = {
        params: { id: "fakeId" },
        body: { catwayState: "NouveauStatut" },
        flash: sinon.spy(),
      };
      const res = { redirect: sinon.spy() };

      await catways.update(req, res);

      // Vérifie que la redirection est appelée avec le bon URL
      sinon.assert.calledWith(res.redirect, "/catways/details_catway/fakeId");
    });

    it("devrait retourner une erreur 404 si le catway n'est pas trouvé", async function () {
      findByIdAndUpdateStub.resolves(null); // Aucun catway trouvé

      const req = {
        params: { id: "fakeId" },
        body: { catwayState: "NouveauStatut" },
        flash: sinon.spy(),
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await catways.update(req, res);

      // Vérifie que le statut 404 et le message JSON sont bien envoyés
      sinon.assert.calledWith(res.status, 404);
      sinon.assert.calledWith(res.json, { message: "Catway non trouvé" });
    });

    it("devrait renvoyer une erreur 500 si une erreur se produit lors de la mise à jour", async function () {
      // Stub pour forcer une erreur
      findByIdAndUpdateStub.rejects(
        new Error("Erreur lors de la mise à jour du catway")
      );

      // Simule une requête et une réponse
      const req = {
        params: { id: "fakeId" },
        body: { catwayState: "NouveauStatut" },
        flash: sinon.spy(),
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await catways.update(req, res);

      // Vérifie que le statut 500 et le message JSON sont bien envoyés
      sinon.assert.calledWith(res.status, 500);
      sinon.assert.calledWith(res.json, { message: "Erreur serveur" });
    });
  });
});

// Test de la fonction delete() du service catways
describe("catways", function () {
  describe("delete()", function () {
    let findByIdAndDeleteStub;

    beforeEach(() => {
      findByIdAndDeleteStub = sinon.stub(Catway, "findByIdAndDelete");
    });

    afterEach(() => {
      sinon.restore();
    });

    it("devrait supprimer un catway avec succès", async function () {
      const fakeCatway = { _id: "fakeId" };
      findByIdAndDeleteStub.resolves(fakeCatway); // Simule un catway trouvé et supprimé

      const req = {
        params: { id: "fakeId" },
        flash: sinon.spy(),
      };
      const res = {
        redirect: sinon.spy(),
      };

      await catways.delete(req, res);

      // Vérifie que la redirection se fait vers "/list_catways"
      sinon.assert.calledWith(res.redirect, "/list_catways");

      // Vérifie que le message flash de succès a été appelé
      sinon.assert.calledWith(
        req.flash,
        "success",
        "Le catway a été supprimé avec succès !"
      );
    });

    it("devrait retourner une erreur 404 si le catway n'est pas trouvé", async function () {
      findByIdAndDeleteStub.resolves(null); // Aucun catway trouvé

      const req = {
        params: { id: "fakeId" },
        flash: sinon.spy(),
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await catways.delete(req, res);

      // Vérifie que la réponse est un statut 404
      sinon.assert.calledWith(res.status, 404);

      // Vérifie que la réponse JSON contient l'erreur attendue
      sinon.assert.calledWith(res.json, { error: "catway_not_found" });
    });

    it("devrait renvoyer une erreur 500 en cas d'échec de la suppression", async function () {
      // Simule une erreur en rejetant la promesse
      findByIdAndDeleteStub.rejects(new Error("Erreur de suppression"));

      const req = {
        params: { id: "fakeId" },
        flash: sinon.spy(),
      };
      const res = {
        redirect: sinon.spy(),
      };

      await catways.delete(req, res);

      // Vérifie que la redirection s'effectue vers "/delete_catway" en cas d'erreur
      sinon.assert.calledWith(res.redirect, "/delete_catway");

      // Vérifie que le message flash d'erreur a bien été appelé
      sinon.assert.calledWith(
        req.flash,
        "error",
        "Une erreur s'est produite lors de la suppression du catway"
      );
    });
  });
});
