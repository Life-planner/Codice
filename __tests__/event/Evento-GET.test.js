/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { getEventi } = require("../../pages/api/event/[IDCalendario]");

describe("Test di tutti i casi GET (ottieni eventi dato IDCalendario e userID)", () => {
  let connection;
  let db;
  let IDCalendarioTest_1;
  let IDCalendarioTest_2;
  let IDEventoTest_1;
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    const UtenteAutenticato = db.collection("UtenteAutenticato");

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoGET",
      email: "utenteTestEventoGET@unitn.it",
      username: "utenteTestEventoGET",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoGETDuplicato",
      email: "utenteTestEventoGETDuplicato@unitn.it",
      username: "utenteTestEventoGETDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoGETDuplicato",
      email: "utenteTestEventoGETDuplicato@unitn.it",
      username: "utenteTestEventoGETDuplicato",
    });

    const CalendarioInserimento = db.collection("Calendario");

    IDCalendarioTest_1 = await CalendarioInserimento.insertOne({
      userId: "utenteTestEventoGET",
      nome: "calendarioTestEventoGET",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestEventoGET"],
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
    IDCalendarioTest_1 = String(IDCalendarioTest_1.insertedId);

    IDCalendarioTest_2 = await CalendarioInserimento.insertOne({
      userId: "utenteTestEventoGET",
      nome: "calendarioTestEventoGET",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestEventoGET"],
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
    IDCalendarioTest_2 = String(IDCalendarioTest_2.insertedId);

    const EventoInserimento = db.collection("Evento");
    IDEventoTest_1 = await EventoInserimento.insertOne({
      userId: "utenteTestEventoGET",
      IDCalendario: IDCalendarioTest_1,
      titolo: "titoloTestGetEvento_1",
      descrizione: "descrizioneTest_1",
      luogo: {
        latitudine: 25.652291,
        longitudine: 51.487782,
      },
      priorita: 6,
      difficolta: 3,
      partecipanti: ["utenteTestEventoGET"],
      notifiche: {
        titolo: "Partita tra poco",
        data: [new Date(1671189531689), new Date(1671189532689)],
      },
      durata: 10,
      isEventoSingolo: true,
      eventoSingolo: {
        data: new Date(1671189531689),
        isScadenza: true,
      },
      eventoRipetuto: null,
    });
    IDEventoTest_1 = String(IDEventoTest_1.insertedId);
  });

  afterAll(async () => {
    await db.collection("Evento").deleteMany({});
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Evento ottenuto dal calendario con successo", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestEventoGET",
          IDCalendario: IDCalendarioTest_1,
        },
      });

      await getEventi(req, res);
      
      expect(res._getStatusCode()).toBe(200);
    });
  });

  describe("400", () => {
    test("Manca il parametro userId", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: null,
          IDCalendario: IDCalendarioTest_1,
        },
      });

      await getEventi(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });

    test("Manca il parametro CalendarioID", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestEventoGET",
          IDCalendario: null,
        },
      });

      await getEventi(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
  });

  describe("409", () => {
    test("Utente non esistente", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteNonEsistente",
          IDCalendario: IDCalendarioTest_1,
        },
      });

      await getEventi(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });
    test("Esiste più di un utente con l'userId inserito", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestEventoGETDuplicato",
          IDCalendario: IDCalendarioTest_1,
        },
      });

      await getEventi(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        }),
      );
    });
    test("Non sono stati trovati calendari con IDCalendario o l'userID dato", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestEventoGET",
          IDCalendario: "6396bd239161940e645f15cb",
        },
      });

      await getEventi(req, res);
      
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no calendar with that ID or you are not part of it",
        }),
      );
    });
    test("Non sono presenti eventi nel calendario inserito", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
          userId: "utenteTestEventoGET",
          IDCalendario: IDCalendarioTest_2,
        },
      });

      await getEventi(req, res);
      
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are no events with that userId and IDCalendario",
        }),
      );
    });
  });
});
