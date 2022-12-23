/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { eliminaEvento } = require("../../pages/api/event/index");

describe("Test di tutti i casi DELETE (elimina evento)", () => {
  let connection;
  let db;
  let IDCalendarioTest;
  let IDEventoTest;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    const UtenteAutenticato = db.collection("UtenteAutenticato");

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoDELETE",
      email: "utenteTestEventoDELETE@prova.unitn.it",
      username: "utenteTestEventoDELETE",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoDELETEDuplicato",
      email: "utenteTestEventoDELETEDuplicato@unitn.it",
      username: "utenteTestEventoDELETEDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoDELETEDuplicato",
      email: "utenteTestEventoDELETEDuplicato@unitn.it",
      username: "utenteTestEventoDELETEDuplicato",
    });

    const CalendarioInserimento = db.collection("Calendario");

    IDCalendarioTest = await CalendarioInserimento.insertOne({
      userId: "utenteTestEventoDELETE",
      nome: "calendarioTestEventoDELETE",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestEventoDELETE"],
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
    IDCalendarioTest = IDCalendarioTest.insertedId;


    const EventoInserimento = db.collection("Evento");
    IDEventoTest = await EventoInserimento.insertOne({
      userId: "utenteTestEventoDELETE",
      IDCalendario: IDCalendarioTest,
      titolo: "titoloTestGetEvento_1",
      descrizione: "descrizioneTest_1",
      luogo: {
        latitudine: 25.652291,
        longitudine: 51.487782,
      },
      priorita: 6,
      difficolta: 3,
      partecipanti: ["utenteTestEventoDELETE"],
      notifiche: {
        titolo: "Partita tra poco",
        data: [1671189531689, 1671189532689],
      },
      durata: 10,
      isEventoSingolo: true,
      eventoSingolo: {
        data: 1671189531689,
        isScadenza: true,
      },
      eventoRipetuto: null,
    });
    IDEventoTest = IDEventoTest.insertedId;
  });

  afterAll(async () => {
    await db.collection("Evento").deleteMany({});
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Evento eliminato con successo", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {
            userId: "utenteTestEventoDELETE",
            IDEvento: IDEventoTest,
        },
    });

      await eliminaEvento(req, res);
      console.log(res._getData());
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event deleted correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca il parametro userId", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: {
              userId: null,
              IDEvento: IDEventoTest,
          },
      });
  
        await eliminaEvento(req, res);
        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca il parametro EventoID", async () => {
        const { req, res } = createMocks({
          method: "GET",
          query: {
              userId: "utenteTestEventoDELETE",
              IDEvento: null
          },
      });
  
        await eliminaEvento(req, res);
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
              IDEvento: IDEventoTest,
          },
      });
  
        await eliminaEvento(req, res);
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
              userId: "utenteTestEventoDELETEDuplicato",
              IDEvento: IDEventoTest,
          },
      });
  
        await eliminaEvento(req, res);
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
              userId: "utenteTestEventoDELETE",
              IDEvento: "EventoNonEsistente",
          },
      });
  
        await eliminaEvento(req, res);
        expect(res._getStatusCode()).toBe(409);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "You do not own the event",
          }),
        );
      });
  });
});