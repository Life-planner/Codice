/**
 * @jest-environment node
 */
import { createMocks } from "node-mocks-http";
import "@testing-library/jest-dom";

const { cancellaTutto } = require("../../models/funzioniDiSupporto");

const { creaUser } = require("../../pages/api/user/index");
const { modificaUser } = require("../../pages/api/user/index");
const { eliminaUser } = require("../../pages/api/user/index");

beforeEach(async () => {
  await cancellaTutto();
});

describe("Test API per l'utente (/api/user/*)", () => {
  describe("Test di tutti i casi POST (creazione utente)", () => {
    describe("200", () => {
      test("Utente iscritto con successo", async () => {
        const { req, res } = createMocks({
          method: "POST",
          query: {
            userId: "utenteTestProva1",
            email: "utenteTestProva1@prova.unitn",
            username: "utenteTestProva1",
          },
        });

        await creaUser(req, res);

        expect(res._getStatusCode()).toBe(200);

        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            success: "User inserted correctly",
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

        await creaUser(req, res);

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

        await creaUser(req, res);

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

        await creaUser(req, res);

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

        await creaUser(req, res);

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

        await creaUser(req, res);

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

        await creaUser(req, res);

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

        await creaUser(req, res);

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

          await creaUser(req, res);

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
          await creaUser(req, res);

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

          await creaUser(req, res);

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

          await modificaUser(req, res);

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

        await modificaUser(req, res);

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

        await modificaUser(req, res);

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

        await modificaUser(req, res);

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

        await modificaUser(req, res);

        expect(res._getStatusCode()).toBe(409);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "There is no user with that userId",
          }),
        );
      });
      test("Utente duplicato", async () => {
        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestProvaRipetutoProvaPutUser",
              email: "utenteTestProvaRipetutoProvaPutUser@prova.unitn",
              username: "utenteTestProvaRipetutoProvaPutUser",
            },
          });

          creaUser(req, res);
          await creaUser(req, res);

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
          await modificaUser(req, res);

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

          await creaUser(req, res);

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

          await eliminaUser(req, res);

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
          query: {
          },
        });

        await eliminaUser(req, res);

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
          method: "DELETE",
          query: {
            userId: "utenteNonEsistente",
          },
        });

        await eliminaUser(req, res);

        expect(res._getStatusCode()).toBe(409);
        expect(JSON.parse(res._getData())).toEqual(
          expect.objectContaining({
            error: "There is no user with that userId",
          }),
        );
      });
      test("Utente duplicato", async () => {
        async () => {
          const { req, res } = createMocks({
            method: "POST",
            query: {
              userId: "utenteTestProvaRipetutoProvaPutUser",
              email: "utenteTestProvaRipetutoProvaPutUser@prova.unitn",
              username: "utenteTestProvaRipetutoProvaPutUser",
            },
          });

          creaUser(req, res);
          await creaUser(req, res);

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
              userId: "utenteTestProvaRipetutoProvaPutUser",
            },
          });

          await eliminaUser(req, res);

          expect(res._getStatusCode()).toBe(409);
          expect(JSON.parse(res._getData())).toEqual(
            expect.objectContaining({
              error: "There are too many users with that userId",
            }),
          );
        };
      });
    });
  });
});
