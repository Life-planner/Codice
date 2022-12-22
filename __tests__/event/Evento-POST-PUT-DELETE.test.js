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

describe("Test API per l'evento (/api/evento/*)", () => {
  describe("Test di tutti i casi POST (creazione evento)", () => {
    describe("200", () => {
      test("Evento inserito con successo, parametri: userId, IDCalendario, titolo, isEventoSingolo", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: true,
          },
        });

        await creaEvento(req, res);

        if (res._getStatusCode() != 200) {
          console.log(res._getData());
        }
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: {
              data: 1671189531689,
              isScadenza: true,
            }
            
            
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            priorita: 5,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            priorita: 5,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: true,
            priorita: 5,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            priorita: 5,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: true,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            difficolta: 1,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: true,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: true,
            partecipanti: "corrige2",
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: {
              data: 1671189531689,
              isScadenza: true
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            notifiche: {
              titolo: "Partita tra poco",
              data: [1671189531689,
              1671189532689]
            },
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            durata: 10,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            eventoSingolo: null,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            userId: "utenteTestPostEvento",
            IDCalendario: "corrige",
            titolo: "titoloTestPostEvento",
            isEventoSingolo: false,
            eventoRipetuto: {
              numeroRipetizioni: 5,
              impostazioniAvanzate: {
                giorniSettimana: [
                  "Sabato",
                  "Domenica"
                ],
                data: 1671194251689
              }
            }
              
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
            email: "utenteTestProva1@prova.unitn",
            username: "utenteTestProva1",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- email", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestProva1",
            username: "utenteTestProva1",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- username", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestProva1",
            email: "utenteTestProva1@prova.unitn",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- userId e email", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            username: "utenteTestProva1",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- userId e username", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            email: "utenteTestProva1@prova.unitn",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- email e username", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestProva1",
          },
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- userId, email e username", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {},
        });

        await postUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
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
  describe("Test di tutti i casi PUT (modifica utente)", () => {
    describe("200", () => {
      test("Utente modificato con successo", async () => {
        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestProva1",
              email: "utenteTestProva1@prova.unitn",
              username: "utenteTestProva1",
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
            method: "PUT",
            query: {
              userId: "utenteTestProva1",
              username: "utenteTestProva10",
            },
          });

          await putUser(req, res);

          expect(res._getStatusCode()).toBe(200);
          expect(JSON.parse(res._getData())).toEqual(
            expect.objectContaining({
              success: "User updated correctly",
            }),
          );
        };
      });
    });

    describe("400", () => {
      test("Manca uno o piu parametri -- userId", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          query: {
            username: "utenteTestProva1",
          },
        });

        await putUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- username", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          query: {
            userId: "utenteTestProva1",
          },
        });

        await putUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });

      test("Manca uno o piu parametri -- userId e username", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          query: {},
        });

        await putUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });
    });

    describe("409", () => {
      test("Utente non esiste", async () => {
        const { req, res } = createMocks({
          method: "PUT",
          query: {
            userId: "utenteNonEsistente",
            username: "utenteTestProva2",
          },
        });

        await putUser(req, res);

        expect(res._getStatusCode()).toBe(409);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "There is no user with that userId",
          }),
        );
      });
      test("Utente dulicato", async () => {
        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestProvaRipetutoProvaPutUser",
              email: "utenteTestProvaRipetutoProvaPutUser@prova.unitn",
              username: "utenteTestProvaRipetutoProvaPutUser",
            },
          });

          postUser(req, res);
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
            method: "PUT",
            query: {
              userId: "utenteTestProvaRipetutoProvaPutUser",
              username: "utenteTestProvaRipetutoProvaPutUser",
            },
          });
          await putUser(req, res);

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
  describe("Test di tutti i casi DELETE (eliminazione utente)", () => {
    describe("200", () => {
      test("Utente eliminato con successo", async () => {
        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestProva1",
              email: "utenteTestProva1@prova.unitn",
              username: "utenteTestProva1",
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
            method: "DELETE",
            query: {
              userId: "utenteTestProva1",
            },
          });

          await deleteUser(req, res);

          expect(res._getStatusCode()).toBe(200);
          expect(JSON.parse(res._getData())).toEqual(
            expect.objectContaining({
              success: "User deleted correctly",
            }),
          );
        };
      });
    });

    describe("400", () => {
      test("Manca uno o piu parametri -- userId", async () => {
        const { req, res } = createMocks({
          method: "DELETE",
          query: {},
        });

        await deleteUser(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "Parameter missing",
          }),
        );
      });
    });
  });
});
