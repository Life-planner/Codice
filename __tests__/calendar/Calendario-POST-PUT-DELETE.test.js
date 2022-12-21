/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const {
  cancellaTutto,
  cancellaTuttoCalendario,
} = require("../../models/funzioniDiSupporto");

const { creaUser } = require("../../pages/api/user/index");

const { creaCalendario } = require("../../pages/api/calendar/index");
const { modificaCalendario } = require("../../pages/api/calendar/index");
const { eliminaCalendario } = require("../../pages/api/calendar/index");

beforeEach(async () => {
  await cancellaTuttoCalendario();
});

beforeAll(async () => {
  await cancellaTutto();
  const { req, res } = createMocks({
    method: "POST",
    query: {
      userId: "utenteTestCalendario",
      email: "utenteTestProvaPostCalendario@prova.unitn",
      username: "utenteTestCalendario",
    },
  });

  await creaUser(req, res);
});

describe("Test API per l'utente (/api/calendar/*)", () => {
  describe("Test di tutti i casi POST (creazione calendario)", () => {
    describe("200", () => {
      test("Calendario inserito con successo con userId, nome del Calendario", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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

      test("Manca il parametro userId, parametri presente: name", async () => {
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
            userId: "utenteTestCalendario",
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
        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestCalendario2",
              email: "utenteTestProvaPostCalendario2@prova.unitn",
              username: "utenteTestCalendario2",
            },
          });

          creaUser(req, res);
          await creaUser(req, res);
        };

        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestCalendario2",
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
        };
      });

      test("Esiste già un calendario principale per questo userId: userId, nome, principale", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestCalendario",
            nome: "calendarioTestProva1",
            principale: true,
          },
        });

        await creaCalendario(req, res);
        await creaCalendario(req, res);

                expect(res._getStatusCode()).toBe(409);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "There are too many primary calendars",
          }),
        );
      });
    });
  });
  describe("Test di tutti i casi PUT (modifica calendario)", () => {
    describe("200", () => {
      test("Calendario aggiornato con successo", async () => {});
    });
  });
});
