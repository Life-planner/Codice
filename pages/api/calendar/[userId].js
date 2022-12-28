import dbConnect from "../../../lib/dbConnect";
import Calendario from "../../../models/Calendario";
import UtenteAutenticato from "../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "GET") {
    getCalendari(req, res);
  }
}

/**
 * @swagger
 * /api/calendar/{userId}:
 *   get:
 *     description: Ritorna tutti i calendari di un utentente dato l'userId
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UserId
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Utente1:
 *           summary: Utente1
 *           value: User1
 *          Utente2:
 *           summary: Utente2
 *           value: User2
 *          Utente3:
 *           summary: Utente3
 *           value: User3
 *     responses:
 *       200:
 *         description: E' stato trovato almeno un calendario e verrà restituito sotto forma di lista
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             calendari:
 *              type: array
 *              items:
 *               type: object
 *               properties:
 *                nome:
 *                 type: string
 *                fusoOrario:
 *                 type: object
 *                 properties:
 *                  GMTOffset:
 *                   type: integer
 *                   minimum: -12
 *                   maximum: 12
 *                  localita:
 *                   type: string
 *                colore:
 *                 type: string
 *                 pattern: '/^#([0-9a-f]{3}){1,2}$/i'
 *                partecipanti:
 *                 type: array
 *                 items:
 *                  type: string
 *                  format: userId
 *                principale:
 *                 type: boolean
 *                impostazioniPredefiniteEventi:
 *                 type: object
 *                 properties:
 *                  titolo:
 *                   type: string
 *                  descrizione:
 *                   type: string
 *                  durata:
 *                   type: integer
 *                   minimum: 1
 *                  tempAnticNotifica:
 *                   type: integer
 *                   minimum: 0
 *                  luogo:
 *                   type: object
 *                   properties:
 *                    latitudine:
 *                     type: string
 *                    longitudine:
 *                     type: string
 *                  priorita:
 *                   type: integer
 *                   minimum: 1
 *                   maximum: 10
 *                  difficolta:
 *                   type: integer
 *                   minimum: 1
 *                   maximum: 10
 *
 *           examples:
 *            Compleanno:
 *             summary: Esempio di un calendario per compleanni
 *             value:
 *              calendari:
 *               - nome: "Compleanni"
 *                 fusoOrario:
 *                  GMTOffset: 0
 *                  localita: "London"
 *                 colore: "#FFAAFF"
 *                 partecipanti: [User1, User2, User3]
 *                 principale: false
 *                 impostazioniPredefiniteEventi:
 *                  titolo: "Compleanno"
 *                  descrizione: "Compleanno di"
 *                  durata: 1440
 *                  tempAnticNotifica: 1440
 *                  luogo:
 *                   latitudine: "12.123123"
 *                   longitudine: "133.123123"
 *                  priorita: 7
 *                  difficolta: 1
 *            Lavoro:
 *             summary: Esempio di un calendario di lavoro
 *             value:
 *              calendari:
 *               - nome: "Lavoro"
 *                 fusoOrario:
 *                  GMTOffset: -5
 *                  localita: "NewYork"
 *                 colore: "#FF0000"
 *                 partecipanti: [User1, User3]
 *                 principale: false
 *                 impostazioniPredefiniteEventi:
 *                  titolo: "Meeting"
 *                  descrizione: "Aggiornamento su "
 *                  durata: 30
 *                  tempAnticNotifica: 10
 *                  luogo:
 *                   latitudine: "12.123123"
 *                   longitudine: "13.123123"
 *                  priorita: 5
 *                  difficolta: 6
 *
 *       400:
 *         description: Manca il parametro userId, verrà restituito "Parameter missing"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Parameter missing
 *       409:
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verrà restituito "There is no user with that userId" <br>Se e' stato trovato più di un account con lo stesso userId, verrà restituito "There are too many users with that userId" <br>Se non sono stati trovati calendari per l'userId dato, verrà restituito "There are no calendars with that userId"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Neanche un utente con l'userId specificato
 *             value:
 *              error: There is no user with that userId
 *            Errore2:
 *             summary: Più utenti con lo stesso userId
 *             value:
 *              error: There are too many users with that userId
 *            Errore3:
 *             summary: Utente senza calendari
 *             value:
 *              error: There are no calendars with that userId
 *       501:
 *         description: Errore generico, verrà restituito "Generic error"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Generic error
 */

export async function getCalendari(req, res) {
  await dbConnect();
  try {
    const { userId } = req.query;

    if (userId == null) {
      res.status(400).json({ error: "Parameter missing" });
      return;
    }

    const users = await UtenteAutenticato.find({
      userId: userId,
    });
    if (Object.keys(users).length == 0) {
      res.status(409).json({ error: "There is no user with that userId" });
      return;
    } else if (Object.keys(users).length > 1) {
      res
        .status(409)
        .json({ error: "There are too many users with that userId" });
      return;
    }

    const calendari = await Calendario.find({
      partecipanti: userId,
    });
    if (Object.keys(calendari).length == 0) {
      res
        .status(409)
        .json({ error: "There are no calendars with that userId" });
      return;
    }
    res.status(200).json({
      calendari,
    });
    return;
  } catch (e) {
    console.error(e);
    res.status(501).json({ error: "Generic error" });
    throw new Error(e).message;
  }
}
