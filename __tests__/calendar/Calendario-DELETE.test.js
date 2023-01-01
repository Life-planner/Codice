/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { eliminaCalendario } = require("../../pages/api/calendar/index");

describe("Test di tutti i casi DELETE (elimina calendario)", () => {
  let connection;
  let db;
  let IDCalendarioTest;
  let IDCalendarioTestNonEsistente;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    const UtenteAutenticato = db.collection("UtenteAutenticato");

    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioDELETE",
      email: "utenteTestCalendarioDELETE@unitn.it",
      username: "utenteTestCalendarioDELETE",
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

    IDCalendarioTest = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestCalendarioDELETE"],
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
    IDCalendarioTest = String(IDCalendarioTest.insertedId);

    IDCalendarioTestNonEsistente = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestCalendarioNonEsistente"],
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
    IDCalendarioTestNonEsistente = String(
      IDCalendarioTestNonEsistente.insertedId
    );
  });

  afterAll(async () => {
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Calendario modificato con successo con userId, nome del Calendario", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioDELETE",
        },
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar deleted correctly",
        })
      );
    });
  });
  describe("400", () => {
    test("Manca un parametro -- IDCalendario", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          userId: "utenteTestCalendarioDELETE",
        },
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        })
      );
    });
    test("Manca un parametro -- userId", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          IDCalendario: IDCalendarioTest,
        },
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        })
      );
    });
    test("Manca un parametro -- IDCalendario, userId", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {},
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        })
      );
    });
  });
  describe("409", () => {
    test("Manca l'utente con l'userId specificato", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioNonEsistente",
        },
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        })
      );
    });
    test("Troppi utenti con l'userId specificato", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioDELETEDuplicato",
        },
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        })
      );
    });
    test("L'utente con l'userId specificato non possiede il calendario", async () => {
      const { req, res } = createMocks({
        method: "DELETE",
        query: {
          IDCalendario: IDCalendarioTestNonEsistente,
          userId: "utenteTestCalendarioDELETE",
        },
      });

      await eliminaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "You do not own the calendar",
        })
      );
    });
  });
});
