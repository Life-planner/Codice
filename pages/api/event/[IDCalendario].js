import dbConnect from "../../../lib/dbConnect";
import Calendario from "../../../models/Calendario";
import Evento from "../../../models/Evento";
import UtenteAutenticato from "../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "GET") {
    getEventi(req, res);
  }
}

/**
 * @swagger
 * /api/event/{IDCalendario}:
 *   get:
 *     description: Ritorna tutti gli eventi di un utentente dato l'userId e IDCalendario
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
 *       - name: IDCalendario
 *         in: query
 *         description: Id del documento all'interno del DataBase
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Esempio1:
 *           summary: Esempio1
 *           value: 6396bd239161940e645f15cb
 *          Esempio2:
 *           summary: Esempio2
 *           value: 6396c4d4563516077ba3b705
 *          Esempio3:
 *           summary: Esempio3
 *           value: 6397d3b9c75299548437182b
 *     responses:
 *       200:
 *         description: E' stato trovato almeno un evento e verra restituito sotto forma di lista
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             eventi:
 *              type: array
 *              items:
 *               type: object
 *               properties:
 *                IDCalendario:
 *                 type: string
 *                titolo:
 *                 type: string
 *                descrizione:
 *                 type: string
 *                luogo:
 *                 type: object
 *                 properties:
 *                  latitudine:
 *                   type: string
 *                  longitudine:
 *                   type: string
 *                priorita:
 *                 type: integer
 *                difficolta:
 *                 type: integer
 *                partecipanti:
 *                 type: array
 *                 items:
 *                  type: string
 *                  format: userId
 *                notifiche:
 *                 type: object
 *                 properties:
 *                  titolo:
 *                   type: string
 *                  data:
 *                   type: array
 *                   items:
 *                    type: date
 *                durata:
 *                 type: integer
 *                isEventoSingolo:
 *                 type: boolean
 *                eventoSingolo:
 *                 type: object
 *                 properties:
 *                  data:
 *                   type: date
 *                  isScadenza:
 *                   type: boolean
 *                eventoRipetuto:
 *                 type: object
 *                 properties:
 *                  numeroRipetizioni:
 *                   type: integer
 *                  impostazioniAvanzate:
 *                   type: object
 *                   properties:
 *                    giorniSettimana:
 *                     type: array
 *                     items:
 *                      type: string
 *                    data:
 *                     type: array
 *                     items:
 *                      type: date
 *
 *           examples:
 *            Meeting:
 *             summary: Esempio di un meeting
 *             value:
 *              eventi:
 *               - IDCalendario: 6396bd239161940e645f15cb
 *                 titolo: Meeting Lavazza
 *                 descrizione:
 *                 luogo:
 *                  latitudine: ""
 *                  longitudine: ""
 *                 priorita: 10
 *                 difficolta: 7
 *                 partecipanti: [User1, Rappresentante3]
 *                 notifiche:
 *                  titolo: Meeting Lavazza
 *                  data: 1671689450
 *                 durata: 90
 *                 isEventoSingolo: true
 *                 eventoSingolo:
 *                  data: 1671689509
 *                  isScadenza: false
 *            Lezione:
 *             summary: Esempio di una lezione
 *             value:
 *              eventi:
 *               - IDCalendario: 6396bd239161940e645f15cb
 *                 titolo: Lezione Analisi
 *                 descrizione:
 *                 luogo:
 *                  latitudine: ""
 *                  longitudine: ""
 *                 priorita: 7
 *                 difficolta: 10
 *                 partecipanti: [User1,]
 *                 notifiche:
 *                  titolo:
 *                  data:
 *                 durata: 120
 *                 isEventoSingolo: false
 *                 eventoRipetuto:
 *                  numeroRipetizioni: 24
 *                  impostazioniAvanzate:
 *                   giorniSettimana: [Lunedi, Giovedi]
 *                   data: 1671692400
 *
 *       400:
 *         description: Manca il parametro userId o IDCalendario, verra restituito "Parameter missing"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Parameter missing
 *       409:
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verra restituito "There is no user with that userId" <br>Se e' stato trovato piu di un account con lo stesso userId, verra restituito "There are too many users with that userId" <br>Se non sono stati trovati calendari con IDCalendario e l'userId dato, verra restituito "There is no calendar with that ID or you are not part of it"<br>Se non ci sono eventi nel calendario indicato, verra restituito "There are no events with that userId and IDCalendario"
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
 *             summary: Piu utenti con lo stesso userId
 *             value:
 *              error: There are too many users with that userId
 *            Errore3:
 *             summary: Calendario inesistente o l'utente non e' parte di esso
 *             value:
 *              error: There is no calendar with that ID or you are not part of it
 *            Errore4:
 *             summary: Nessun evento nel calendario indicato in cui l'utente indicato e' partecipe
 *             value:
 *              error: There are no events with that userId and IDCalendario
 *       501:
 *         description: Errore generico, verra restituito "Generic error"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Generic error
 *
 */

export async function getEventi(req, res) {
  await dbConnect();
  try {
    const { IDCalendario } = req.query;
    const { userId } = req.query;

    if (IDCalendario == null || userId == null) {
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
    var ObjectId = require("mongoose").Types.ObjectId;

    const calendariPosseduti = await Calendario.find({
      $and: [{ partecipanti: userId }, { _id: new ObjectId(IDCalendario) }],
    });
    if (Object.keys(calendariPosseduti).length == 0) {
      res.status(409).json({
        error: "There is no calendar with that ID or you are not part of it",
      });
      return;
    }

    const eventi = await Evento.find({
      $and: [
        { partecipanti: userId },
        { IDCalendario: new ObjectId(IDCalendario) },
      ],
    });
    if (Object.keys(eventi).length == 0) {
      res.status(409).json({
        error: "There are no events with that userId and IDCalendario",
      });
      return;
    }
    res.status(200).json({
      eventi,
    });
    return;
  } catch (e) {
    console.error(e);
    res.status(501).json({ error: "Generic error" });
    throw new Error(e).message;
  }
}
