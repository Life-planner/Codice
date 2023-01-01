/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { getUser } = require("../../pages/api/user/email/[email].js");

describe("Test di tutti i casi GET con email", () => {
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
      userId: "utenteTestGET1",
      email: "utenteTestGET1@unitn.it",
      username: "utenteTestGET1",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestGETDuplicato",
      email: "utenteTestGETDuplicato@unitn.it",
      username: "utenteTestGETDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestGETDuplicato",
      email: "utenteTestGETDuplicato@unitn.it",
      username: "utenteTestGETDuplicato",
    });
  });

  afterAll(async () => {
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Utente ottenuto con successo", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          email: "utenteTestGET1@unitn.it",
        },
      });

      await getUser(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          userId: "utenteTestGET1",
          email: "utenteTestGET1@unitn.it",
          username: "utenteTestGET1",
        })
      );
    });
  });

  describe("400", () => {
    test("Manca il parametro", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {},
      });

      await getUser(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing or malformed",
        })
      );
    });
  });

  describe("409", () => {
    test("Utente non esiste", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          email: "utenteNonEsiste@unitn.it",
        },
      });

      await getUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that email",
        })
      );
    });
    test("Utente duplicato", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          email: "utenteTestGETDuplicato@unitn.it",
        },
      });
      await getUser(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that email",
        })
      );
    });
  });
});
