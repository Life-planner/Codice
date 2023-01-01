/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { modificaEvento } = require("../../pages/api/event/index");

describe("Test di tutti i casi PUT (modifica evento)", () => {
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
      userId: "utenteTestEventoPUT",
      email: "utenteTestEventoPUT@unitn.it",
      username: "utenteTestEventoPUT",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPUTDuplicato",
      email: "utenteTestEventoPUTDuplicato@unitn.it",
      username: "utenteTestEventoPUTDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestEventoPUTDuplicato",
      email: "utenteTestEventoPUTDuplicato@unitn.it",
      username: "utenteTestEventoPUTDuplicato",
    });

    const CalendarioInserimento = db.collection("Calendario");

    IDCalendarioTest = await CalendarioInserimento.insertOne({
      userId: "utenteTestEventoPUT",
      nome: "calendarioTestEventoPUT",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestEventoPUT"],
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

    const EventoInserimento = db.collection("Evento");
    IDEventoTest = await EventoInserimento.insertOne({
      userId: "utenteTestEventoPUT",
      IDCalendario: IDCalendarioTest,
      titolo: "titoloTestPutEvento",
      descrizione: "descrizioneTest",
      luogo: {
        latitudine: 25.652291,
        longitudine: 51.487782,
      },
      priorita: 6,
      difficolta: 3,
      partecipanti: ["utenteTestEventoPUT"],
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
    IDEventoTest = String(IDEventoTest.insertedId);
  });

  afterAll(async () => {
    await db.collection("Evento").deleteMany({});
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Evento modificato con successo -- isEventoSingolo = false", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event edited correctly",
        }),
      );
    });
    test("Evento modificato con successo -- isEventoSingolo = true", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: true,
          eventoSingolo: {
            data: 16718931689,
            isScadenza: true,
          },
          eventoRipetuto: null,
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Event edited correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca uno o più parametri -- IDCalendario ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- IDEvento ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- titolo ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- descrizione ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- luogo ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- priorita ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- difficolta ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- partecipanti ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- notifiche ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- durata ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- isEventoSingolo ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- eventoSingolo ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: true,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o più parametri -- eventoRipetuto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: null,
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Formato parametro luogo non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 190.0,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for location",
        }),
      );
    });
    test("Formato parametro priorita non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: -1,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for priorita",
        }),
      );
    });
    test("Formato parametro difficolta non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: -1,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for difficolta",
        }),
      );
    });
    test("Formato parametro notifiche non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: null,
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for notifiche",
        }),
      );
    });
    test("Formato parametro durata non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: -1,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for durata",
        }),
      );
    });
    test("Formato parametro eventoSingolo non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: true,
          eventoSingolo: {
            data: new Date(1671189531689),
            isScadenza: null,
          },
          eventoRipetuto: null,
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for eventoSingolo",
        }),
      );
    });
    test("Formato parametro eventoRipetuto non corretto ", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for eventoRipetuto",
        }),
      );
    });
  });

  describe("409", () => {
    test("UserId dato non esistente", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteNonEsistente",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });
    test("Esistono più di un utente con l'userId dato", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUTDuplicato",
          IDEvento: IDEventoTest,
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There are too many users with that userId",
        }),
      );
    });
    test("Non esiste l'IDCalendario oppure l'userId non possiede tale calendario", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: IDEventoTest,
          IDCalendario: "6396bd239161940e645f15cb",
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error:
            "There is no calendar with that ID or you do not own the calendar",
        }),
      );
    });
    test("Non esiste l'IDEvento oppure l'userId non possiede tale evento", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestEventoPUT",
          IDEvento: "6396bd239161940e645f15cb",
          IDCalendario: IDCalendarioTest,
          titolo: "titoloTestPostEventoNuovo",
          descrizione: "descrizioneTest",
          luogo: {
            latitudine: 25.652291,
            longitudine: 51.487782,
          },
          priorita: 6,
          difficolta: 3,
          partecipanti: ["utenteTestEventoPUT"],
          notifiche: {
            titolo: "Partita tra poco",
            data: [new Date(1671189531689), new Date(1671189532689)],
          },
          durata: 10,
          isEventoSingolo: false,
          eventoSingolo: null,
          eventoRipetuto: {
            numeroRipetizioni: 5,
            impostazioniAvanzate: {
              giorniSettimana: ["Sabato", "Domenica"],
              data: new Date(1671194251689),
            },
          },
        },
      });

      await modificaEvento(req, res);
      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "You do not own the event",
        }),
      );
    });
  });
});
