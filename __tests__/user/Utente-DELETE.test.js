/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { eliminaUser } = require("../../pages/api/user/index");

describe("Test di tutti i casi DELETE (eliminazione utente)", () => {
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
      userId: "utenteTestDELETE",
      email: "utenteTestDELETE@prova.unitn",
      username: "utenteTestDELETE",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestDELETEDuplicato",
      email: "utenteTestDELETEDuplicato@prova.unitn",
      username: "utenteTestDELETEDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestDELETEDuplicato",
      email: "utenteTestDELETEDuplicato@prova.unitn",
      username: "utenteTestDELETEDuplicato",
    });
  });

  afterAll(async () => {
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Utente eliminato con successo", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          userId: "utenteTestDELETE",
        },
      });

      await eliminaUser(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "User deleted correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca uno o piu parametri -- userId", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {},
      });

      await eliminaUser(req, res);

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
        method: "DELETE",
        query: {
          userId: "utenteNonEsistente",
        },
      });

      await eliminaUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });
    test("Utente duplicato", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          userId: "utenteTestDELETEDuplicato",
        },
      });

      await eliminaUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        }),
      );
    });
  });
});
