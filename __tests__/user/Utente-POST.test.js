/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { creaUser } = require("../../pages/api/user/index");

describe("Test di tutti i casi POST (creazione utente)", () => {

  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection("UtenteAutenticato").deleteMany({});
  });

  describe("200", () => {
    test("Utente iscritto con successo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestProva123123",
          email: "utenteTestProva123123@prova.unitn",
          username: "utenteTestProva123123",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "User inserted correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca uno o piu parametri -- userId", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          email: "utenteTestProva11@prova.unitn",
          username: "utenteTestProva11",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- email", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestProva12",
          username: "utenteTestProva12",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- username", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestProva13",
          email: "utenteTestProva13@prova.unitn",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- userId e email", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          username: "utenteTestProva14",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- userId e username", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          email: "utenteTestProva14@prova.unitn",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- email e username", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestProva15",
        },
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- userId, email e username", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {},
      });

      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
  });

  describe("409", () => {
    test("Utente esiste gia", async () => {

      const UtenteAutenticato = db.collection("UtenteAutenticato");

      await UtenteAutenticato.insertOne({
        userId: "utenteTestProvaDuplicato",
        email: "utenteTestProvaDuplicato@prova.unitn",
        username: "utenteTestProvaDuplicato",
      });


      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestProvaDuplicato",
          email: "utenteTestProvaDuplicato@prova.unitn",
          username: "utenteTestProvaDuplicato",
        },
      });
      await creaUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is alrady one user with that id or email",
        }),
      );
    });
  });
});
