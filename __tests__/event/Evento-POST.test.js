/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { creaEvento } = require("../../pages/api/event/index");

describe("Test di tutti i casi POST (creazione evento)", () => {
  let connection;
  let db;
  let IDCalendarioTest;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();

    const UtenteAutenticato = db.collection("UtenteAutenticato");

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPOST",
      email: "utenteTestEventoPOST@prova.unitn.it",
      username: "utenteTestEventoPOST",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPOSTDuplicato",
      email: "utenteTestEventoPOSTDuplicato@prova.unitn",
      username: "utenteTestEventoPOSTDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPOSTDuplicato",
      email: "utenteTestEventoPOSTDuplicato@prova.unitn",
      username: "utenteTestEventoPOSTDuplicato",
    });

    const CalendarioInserimento = db.collection("Calendario");

    IDCalendarioTest = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST",
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
    IDCalendarioTest = IDCalendarioTest.insertedId 
  });

  afterAll(async () => {
    await db.collection("Evento").deleteMany({});
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  beforeEach(async () => {
    await db.collection("Evento").deleteMany({});
  });

  describe("200", () => {
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita, difficolta", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita, difficolta, partecipanti", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo,descrizione, luogo, priorita, difficolta, partecipanti, notifiche", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita, difficolta, partecipanti, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita, difficolta, partecipanti, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita, difficolta, partecipanti, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, descrizione, luogo, priorita, difficolta, partecipanti, notifiche, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          descrizione: "descrizioneTestPostEvento",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, partecipanti", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, partecipanti, notifiche", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, partecipanti, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, partecipanti, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, partecipanti, notifiche, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, partecipanti", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, partecipanti, notifiche", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, partecipanti, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, partecipanti, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, partecipanti, notifiche, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, partecipanti", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
          partecipanti: "corrige2",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, partecipanti, notifiche", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, partecipanti, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, partecipanti, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, partecipanti, notifiche, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, partecipanti", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          partecipanti: "corrige2",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, partecipanti, notifiche", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, partecipanti, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, partecipanti, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, partecipanti, notifiche, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          partecipanti: "corrige2",
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          notifiche: {
            titolo: "Partita tra poco",
            data: [1671189531689, 1671189532689],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, durata", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          durata: 10,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          durata: 10,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, durata, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: 1671189531689,
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, eventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: 1671194251689,
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca uno o piu parametri -- userId", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- IDCalendario", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        }),
      );
    });

    
    test("Manca uno o piu parametri -- titolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          isEventoSingolo: true,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        }),
      );
    });

    test("Manca uno o piu parametri -- isEventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        }),
      );
    });















    test("Manca uno o piu parametri -- isEventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        }),
      );
    });

  });

  describe("409", () => {
    test("Utente esiste gia", async () => {
      async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestProva2",
            email: "utenteTestProva2@prova.unitn",
            username: "utenteTestProva2",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            success: "User inserted correctly",
          }),
        );
      };

      async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestProva2",
            email: "utenteTestProva2@prova.unitn",
            username: "utenteTestProva2",
          },
        });
        await postUser(req, res);

        expect(res._getStatusCode()).toBe(409);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "There is alrady one user with that id or email",
          }),
        );
      };
    });
  });
});
