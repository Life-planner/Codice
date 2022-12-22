/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { modificaUser } = require("../../pages/api/user/index");

describe("Test di tutti i casi PUT (modifica utente)", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    const UtenteAutenticato = db.collection("UtenteAutenticato");

    await UtenteAutenticato.insertOne({
      userId: "utenteTestProvaPUT",
      email: "utenteTestProvaPUT@prova.unitn",
      username: "utenteTestProvaPUT",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestProvaPUTDuplicato",
      email: "utenteTestProvaPUTDuplicato@prova.unitn",
      username: "utenteTestProvaPUTDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestProvaPUTDuplicato",
      email: "utenteTestProvaPUTDuplicato@prova.unitn",
      username: "utenteTestProvaPUTDuplicato",
    });
  });

  afterAll(async () => {
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Utente modificato con successo", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestProvaPUT",
          username: "utenteTestProvaPUT10",
        },
      });

      await modificaUser(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "User updated correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca uno o piu parametri -- userId", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          username: "utenteTestProva1",
        },
      });

      await modificaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- username", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestProva1",
        },
      });

      await modificaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- userId e username", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {},
      });

      await modificaUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
  });

  describe("409", () => {
    test("Utente non esiste", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteNonEsistente",
          username: "utenteTestProva2",
        },
      });

      await modificaUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });
    test("Utente duplicato", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestProvaPUTDuplicato",
          username: "utenteTestProvaPUTDuplicato22",
        },
      });
      await modificaUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        }),
      );
    });
  });
});
