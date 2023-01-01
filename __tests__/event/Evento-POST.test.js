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
      email: "utenteTestEventoPOST@unitn.it",
      username: "utenteTestEventoPOST",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPOSTDuplicato",
      email: "utenteTestEventoPOSTDuplicato@unitn.it",
      username: "utenteTestEventoPOSTDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPOSTDuplicato",
      email: "utenteTestEventoPOSTDuplicato@unitn.it",
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
      partecipanti: ["utenteTestEventoPOST"],
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
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
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
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, eventoSingolo", async () => {
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
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, eventoRipetuto", async () => {
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
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, eventoSingolo", async () => {
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
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, eventoRipetuto", async () => {
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
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, eventoSingolo", async () => {
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
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, eventoRipetuto", async () => {
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
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, notifiche, eventoSingolo", async () => {
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
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo,luogo, priorita, difficolta, notifiche, eventoRipetuto", async () => {
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
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, notifiche, durata, eventoSingolo", async () => {
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
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, luogo, priorita, difficolta, notifiche, durata, eventoRipetuto", async () => {
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
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          priorita: 5,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          priorita: 5,
          difficolta: 1,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, notifiche, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          priorita: 5,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, notifiche, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          priorita: 5,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, priorita, difficolta, notifiche, durata, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          priorita: 5,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          difficolta: 1,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, notifiche, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, notifiche, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, notifiche, durata, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          difficolta: 1,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, difficolta, notifiche, durata, eventoRipetuto", async () => {
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
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
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
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, notifiche, durata, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(16718931689), new Date(16718932689)],
          },
          durata: 10,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
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
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
    test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo, durata, eventoRipetuto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          durata: 10,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(200);

      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event inserted correctly",
        })
      );
    });
  });

  describe("400", () => {
    test("Manca uno o piu parametri -- IDCalendario, parametri presenti: userId, titolo, isEventoSingolo, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        })
      );
    });
    test("Manca uno o piu parametri -- userId, parametri presenti: IDCalendario, titolo, isEventoSingolo, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        })
      );
    });

    test("Manca uno o piu parametri -- titolo, parametri presenti: userId, IDCalendario, isEventoSingolo, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        })
      );
    });

    test("Manca uno o piu parametri -- isEventoSingolo, parametri presenti: userId, IDCalendario, eventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        })
      );
    });

    test("Manca uno o piu parametri -- eventoSingolo, parametri presenti; userId, IDCalendario, isEventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: null,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        })
      );
    });
    test("Manca uno o piu parametri -- eventoRipetuto, parametri presenti; userId, IDCalendario, isEventoSingolo", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: false,
          eventoRipetuto: null,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "IDCalendario or titolo or evento details missing",
        })
      );
    });
    test("Formato parametro luogo non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          luogo: {
            latitudine: null,
            longitudine: null,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for location",
        })
      );
    });
    test("Formato parametro luogo non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          luogo: {
            latitudine: 25.652291,
            longitudine: 190.0,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for location",
        })
      );
    });
    test("Formato parametro luogo non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          luogo: {
            latitudine: 25.652291,
            longitudine: null,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for location",
        })
      );
    });
    test("Formato parametro luogo non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          luogo: {
            latitudine: null,
            longitudine: 51.487782,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for location",
        })
      );
    });
    test("Formato parametro priorita non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          priorita: -1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for priorita",
        })
      );
    });
    test("Formato parametro difficolta non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          difficolta: -1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for difficolta",
        })
      );
    });
    test("Formato parametro notifiche non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          notifiche: {
            titolo: null,
            data: [new Date(16718931689), new Date(16718932689)],
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for notifiche",
        })
      );
    });
    test("Formato parametro notifiche non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          notifiche: {
            titolo: "Partita tra poco",
            data: null,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for notifiche",
        })
      );
    });
    test("Formato parametro notifiche non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          notifiche: {
            titolo: null,
            data: null,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for notifiche",
        })
      );
    });
    test("Formato parametro durata non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
          durata: -1,
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for durata",
        })
      );
    });
    test("Formato parametro eventoSingolo non corretto", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: null,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for eventoSingolo",
        })
      );
    });
    test("Formato parametro eventoRipetuto non corretto", async () => {
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
              data: new Date(1671194251689),
            },
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for eventoRipetuto",
        })
      );
    });
  });

  describe("409", () => {
    test("Ci sono più di un utente con l'userId dato", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOSTDuplicato",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        })
      );
    });
    test("Utente non esistente", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "UtenteNonEsistente",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        })
      );
    });
    test("IDcalendario non esistente o userId non possiede tale IDCalendario", async () => {
      const { req, res } = createMocks({
        method: "POST",
        query: {
          userId: "utenteTestEventoPOST",
          IDCalendario: "6396bd239161940e645f15cb",
          titolo: "titoloTestPostEvento",
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(16718931689),
            isScadenza: true,
          },
        },
      });

      await creaEvento(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error:
            "There is no calendar with that ID or you do not own the calendar",
        })
      );
    });
  });
});
