/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { getCalendari } = require("../../pages/api/calendar/[userId]");

describe("Test di tutti i casi DELETE (elimina calendario)", () => {
  let connection;
  let db;
  let IDCalendarioTest1;
  let IDCalendarioTest2;
  let IDCalendarioTest3;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    const UtenteAutenticato = db.collection("UtenteAutenticato");

    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioDELETE1calendario",
      email: "utenteTestCalendarioDELETE1calendario@unitn.it",
      username: "utenteTestCalendarioDELETE1calendario",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioDELETE2calendari",
      email: "utenteTestCalendarioDELETE2calendari@unitn.it",
      username: "utenteTestCalendarioDELETE2calendari",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioDELETESenzaCalendari",
      email: "utenteTestCalendarioDELETESenzaCalendari@unitn.it",
      username: "utenteTestCalendarioDELETESenzaCalendari",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioDELETEDuplicato",
      email: "utenteTestCalendarioDELETEDuplicato@unitn.it",
      username: "utenteTestCalendarioDELETEDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioDELETEDuplicato",
      email: "utenteTestCalendarioDELETEDuplicato@unitn.it",
      username: "utenteTestCalendarioDELETEDuplicato",
    });

    const CalendarioInserimento = db.collection("Calendario");

    IDCalendarioTest1 = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST1",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestCalendarioDELETE2calendari"],
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
    IDCalendarioTest1 = String(IDCalendarioTest1.insertedId);

    IDCalendarioTest2 = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST2",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestCalendarioDELETE2calendari"],
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
    IDCalendarioTest2 = String(IDCalendarioTest2.insertedId);

    IDCalendarioTest3 = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST3",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestCalendarioDELETE1calendario"],
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
    IDCalendarioTest3 = String(IDCalendarioTest3.insertedId);
  });

  afterAll(async () => {
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Get calendario utente con 1 calendario", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestCalendarioDELETE1calendario",
        },
      });

      await getCalendari(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
    test("Get calendario utente con 2 calendari", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestCalendarioDELETE2calendari",
        },
      });

      await getCalendari(req, res);

      expect(res._getStatusCode()).toBe(200);
    });
  });
  describe("400", () => {
    test("Manca il parametro userId", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
      });

      await getCalendari(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
  });
  describe("409", () => {
    test("Manca l'account con l'userId specificato", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestCalendarioDELETENonEsistente",
        },
      });

      await getCalendari(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });
    test("E' stato trovato piu di un utente con l'userId specificato", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestCalendarioDELETEDuplicato",
        },
      });

      await getCalendari(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        }),
      );
    });
    test("L'utente con l'userId specificato non ha calendari", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestCalendarioDELETESenzaCalendari",
        },
      });

      await getCalendari(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are no calendars with that userId",
        }),
      );
    });
  });
});
