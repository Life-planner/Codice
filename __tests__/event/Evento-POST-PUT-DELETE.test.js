/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const {
  cancellaTutto,
  cancellaTuttoEvento,
} = require("../../models/funzioniDiSupporto");

const { creaUser } = require("../../pages/api/user/index");

const { creaCalendario } = require("../../pages/api/calendar/index");
const { modificaCalendario } = require("../../pages/api/calendar/index");
const { eliminaCalendario } = require("../../pages/api/calendar/index");

beforeEach(async () => {
  await cancellaTuttoEvento();
});

beforeAll(async () => {
  await cancellaTutto();
  async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        userId: "utenteTestEvento",
        email: "utenteTestPostEvento@prova.unitn.it",
        username: "utenteTestPostEvento",
      },
    });
    await postUser(req, res);
  };
  async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        userId: "utenteTestEvento",
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
  };
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

        if (res._getStatusCode() != 200) {
          console.log(res._getData());
        }
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            success: "Calendar inserted correctly",
          }),
        );
      });
    });
  });
});
