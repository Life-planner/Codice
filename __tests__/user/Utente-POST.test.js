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
          userId: "utenteTest123123",
          email: "utenteTest123123@unitn.it",
          username: "utenteTest123123",
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
          email: "utenteTest11@unitn.it",
          username: "utenteTest11",
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
          userId: "utenteTest12",
          username: "utenteTest12",
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
          userId: "utenteTest13",
          email: "utenteTest13@unitn.it",
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
          username: "utenteTest14",
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
          email: "utenteTest14@unitn.it",
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
          userId: "utenteTest15",
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
        userId: "utenteTestDuplicato",
        email: "utenteTestDuplicato@unitn.it",
        username: "utenteTestDuplicato",
      });

      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestDuplicato",
          email: "utenteTestDuplicato@unitn.it",
          username: "utenteTestDuplicato",
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
