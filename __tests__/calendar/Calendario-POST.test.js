/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { creaCalendario } = require("../../pages/api/calendar/index");

describe("Test di tutti i casi POST (creazione calendario)", () => {
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
      userId: "utenteTestCalendarioPOST",
      email: "utenteTestCalendarioPOST@unitn.it",
      username: "utenteTestCalendarioPOST",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioPOSTDuplicato",
      email: "utenteTestCalendarioPOSTDuplicato@unitn.it",
      username: "utenteTestCalendarioPOSTDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioPOSTDuplicato",
      email: "utenteTestCalendarioPOSTDuplicato@unitn.it",
      username: "utenteTestCalendarioPOSTDuplicato",
    });
  });

  afterAll(async () => {
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection("Calendario").deleteMany({});
  });

  describe("200", () => {
    test("Calendario inserito con successo con userId, nome del Calendario", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, fusoOrario", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, fusoOrario, colore", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#00FF00",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, fusoOrario, colore, principale", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#00FF00",
          principale: false,
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, fusoOrario, principale", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          principale: false,
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, colore", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          colore: "#00FF00",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, colore, principale", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          colore: "#00FF00",
          principale: false,
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });

    test("Calendario inserito con successo con userId, nome, principale", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          principale: false,
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar inserted correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca il parametro name, parametri presente: userId", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Name missing",
        }),
      );
    });

    test("Manca il parametro userId, parametri presente: name", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          nome: "calendarioTestProva1",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Name missing",
        }),
      );
    });

    test("Manca il parametro userId, name", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {},
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Name missing",
        }),
      );
    });

    test("Il colore è stato passato, ma il formato non è corretto, parametri presenti: userId, nome", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          colore: "colore_inesistente",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for color",
        }),
      );
    });

    test("Il fusoOrario è stato passato, ma il formato non è corretto, parametri presenti: userId, nome", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          fusoOrario: {
            GMTOffset: -14,
            localita: "New York",
          },
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for time zone",
        }),
      );
    });

    test("Il fusoOrario è stato passato, ma il formato non è corretto, parametri presenti: userId, nome", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1",
          fusoOrario: {
            GMTOffset: -10,
          },
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for time zone",
        }),
      );
    });
  });

  describe("409", () => {
    test("Esiste già un calendario principale per questo userId: userId, nome, principale", async () => {
      const CalendarioInserimento = db.collection("Calendario");

      await CalendarioInserimento.insertOne({
        nome: "calendarioTestProva1true",
        fusoOrario: {
          GMTOffset: -5,
          localita: "New York",
        },
        colore: "#7C36B9",
        partecipanti: ["utenteTestCalendarioPOST"],
        principale: true,
        impostazioniPredefiniteEventi: {
          titolo: "",
          descrizione: "",
          durata: 30,
          tempAnticNotifica: 30,
          luogo: {
            latitudine: "",
            longitudine: "",
          },
          priorita: 6,
          difficolta: 6,
        },
      });

      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOST",
          nome: "calendarioTestProva1true",
          principale: true,
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many primary calendars",
        }),
      );
    });

    test("Utente non esiste, parametri presente: userId, nome", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteNonEsistente",
          nome: "calendarioTestProva1",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });

    test("Utente duplicato, parametri presenti: userId, nome", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestCalendarioPOSTDuplicato",
          nome: "calendarioTestProva1",
        },
      });

      await creaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        }),
      );
    });
  });
});
