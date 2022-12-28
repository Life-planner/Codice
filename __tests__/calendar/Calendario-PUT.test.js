/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { MongoClient } = require("mongodb");

const { modificaCalendario } = require("../../pages/api/calendar/index");

describe("Test di tutti i casi PUT (modifica calendario)", () => {
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
      userId: "utenteTestCalendarioPUT",
      email: "utenteTestCalendarioPUT@unitn.it",
      username: "utenteTestCalendarioPUT",
    });
    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioPUTDuplicato",
      email: "utenteTestCalendarioPUTDuplicato@unitn.it",
      username: "utenteTestCalendarioPUTDuplicato",
    });

    await UtenteAutenticato.insertOne({
      userId: "utenteTestCalendarioPUTDuplicato",
      email: "utenteTestCalendarioPUTDuplicato@unitn.it",
      username: "utenteTestCalendarioPUTDuplicato",
    });

    const CalendarioInserimento = db.collection("Calendario");

    IDCalendarioTest = await CalendarioInserimento.insertOne({
      nome: "calendarioTestEventoPOST",
      fusoOrario: {
        GMTOffset: -5,
        localita: "New York",
      },
      colore: "#7C36B9",
      partecipanti: ["utenteTestCalendarioPUT"],
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
    IDCalendarioTestNonEsistente = String(IDCalendarioTestNonEsistente.insertedId);
  });

  afterAll(async () => {
    await db.collection("Calendario").deleteMany({});
    await db.collection("UtenteAutenticato").deleteMany({});
    await connection.close();
  });

  describe("200", () => {
    test("Calendario modificato con successo con userId, nome del Calendario, fusoOrario, colore, partecipanti, principale, impostazioniPredefiniteEventi, priorita, difficolta", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          success: "Calendar updated correctly",
        }),
      );
    });
  });

  describe("400", () => {
    test("Manca uno o piu parametri -- IDCalendario", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- userId", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- nome", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- fusoOrario", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- fusoOrario GMTOffset", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- fusoOrario localita", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- colore", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- partecipanti", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - titolo", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - descrizione", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - durata", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - tempAnticNotifica", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - luogo", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - luogo - latitudine", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - luogo - longitudine", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - priorita", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Manca uno o piu parametri -- impostazioniPredefiniteEventi - difficolta", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Parameter missing",
        }),
      );
    });
    test("Valore GTMOffset del fuso orario non e' valido", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -50,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for time zone",
        }),
      );
    });
    test("Valore colore non e' valido", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "ColNoValido",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format for color",
        }),
      );
    });
    test("Valore impostazioni predefinite non e' valido - latitudine", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#123456",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 112.123465,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format impostazioni predefinite",
        }),
      );
    });
    test("Valore impostazioni predefinite non e' valido - longitudine", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#123456",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 1102.123465,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format impostazioni predefinite",
        }),
      );
    });
    test("Valore impostazioni predefinite non e' valido - priorita", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#123456",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 60,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format impostazioni predefinite",
        }),
      );
    });
    test("Valore impostazioni predefinite non e' valido - difficolta", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#123456",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: -6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format impostazioni predefinite",
        }),
      );
    });
    test("Valore impostazioni predefinite non e' valido - durata", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#123456",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: -30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format impostazioni predefinite",
        }),
      );
    });
    test("Valore impostazioni predefinite non e' valido - tempAnticNotifica", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#123456",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: -30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "Wrong format impostazioni predefinite",
        }),
      );
    });
  });

  describe("409", () => {
    test("Manca l'utente con l'userId specificato", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteNonEsistente",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "There is no user with that userId",
        }),
      );
    });
    test("Piu di un utente con lo stesso userId specificato", async () => {
      const { req, res } = createMocks({
        method: "PUT",
        query: {
          IDCalendario: IDCalendarioTest,
          userId: "utenteTestCalendarioPUTDuplicato",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

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
          IDCalendario: IDCalendarioTestNonEsistente,
          userId: "utenteTestCalendarioPUT",
          nome: "utenteTestCalendarioPUT",
          fusoOrario: {
            GMTOffset: -5,
            localita: "New York",
          },
          colore: "#7C36B9",
          partecipanti: ["utenteTestCalendarioPUT"],
          principale: true,
          impostazioniPredefiniteEventi: {
            titolo: "",
            descrizione: "",
            durata: 30,
            tempAnticNotifica: 30,
            luogo: {
              latitudine: 12.123456,
              longitudine: 12.123456,
            },
            priorita: 6,
            difficolta: 6,
          },
        },
      });

      await modificaCalendario(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          error: "You do not own the calendar",
        }),
      );
    });
  });
});
