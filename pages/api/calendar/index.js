import dbConnect from "../../../lib/dbConnect";
import Calendario from "../../../models/Calendario";
import UtenteAutenticato from "../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "POST") {
    creaCalendario(req, res);
  } else if (req.method === "PUT") {
    modificaCalendario(req, res);
  } else if (req.method === "DELETE") {
    eliminaCalendario(req, res);
  }
}

/**
 * @swagger
 * /api/calendar/:
 *   post:
 *     description: Crea un calendario dati nome, userId, fusoOrario, colore con cui verrà visualizzato, e se e' il calendario principale o meno
 *     parameters:
 *       - name: userId
 *         in: query
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
 *       - name: nome
 *         in: query
 *         description: Nome del calendario
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Compleanni:
 *           summary: Calendario per compleanni
 *           value: Compleanni
 *          Progetti:
 *           summary: Calendario per progetti
 *           value: Progetti
 *          Lezioni:
 *           summary: Calendario per le lezioni
 *           value: Lezioni
 *       - name: fusoOrario
 *         in: query
 *         description: Oggetto contente il fuso orario e il capoluogo relativo
 *         required: false
 *         allowEmptyValue: false
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             GMTOffset:
 *              type: integer
 *              minimum: -12
 *              maximum: 12
 *             localita:
 *              type: string
 *         examples:
 *          Londra:
 *           summary: Fuso orario di Londra
 *           value:
 *            GMTOffset: 0
 *            localita: London
 *          Roma:
 *           summary: Fuso orario di Roma
 *           value:
 *            GMTOffset: 1
 *            localita: Rome
 *          NewYork:
 *           summary: Fuso orario di New York
 *           value:
 *            GMTOffset: -5
 *            localita: New York
 *       - name: colore
 *         in: query
 *         description: Colore con cui verranno visti gli eventi del calendario
 *         required: false
 *         schema:
 *          type: string
 *         allowEmptyValue: false
 *         examples:
 *          Rosso:
 *           summary: Rosso
 *           value: "#FF0000"
 *          Verde:
 *           summary: Verde
 *           value: "#00FF00"
 *          Blu:
 *           summary: Blu
 *           value: "#0000FF"
 *          Giallo:
 *           summary: Giallo
 *           value: "#FFFF00"
 *          Ciano:
 *           summary: Ciano
 *           value: "#00FFFF"
 *          Magenta:
 *           summary: Magenta
 *           value: "#FF00FF"
 *       - name: principale
 *         in: query
 *         description: Valore booleano che indica se il calendario e' il calendario principale o meno
 *         required: false
 *         schema:
 *          type: boolean
 *          example: false
 *         allowEmptyValue: false
 *       - name: partecipanti
 *         in: query
 *         description: Nuova lista dei partecipanti
 *         required: false
 *         schema:
 *          type: array
 *          items:
 *           type: string
 *         examples:
 *          Utente1:
 *           summary: Utente1
 *           value: [User1]
 *          Utente12:
 *           summary: Utente1 e Utente2
 *           value: [User1, User2]
 *          Utente123:
 *           summary: Utente1, Utente2 e Utente3
 *           value: [User1, User2, User3]
 *          Utente13:
 *           summary: Utente1 e Utente3
 *           value: [User1, User3]
 *          Utente23:
 *           summary: Utente2 e Utente3
 *           value: [User2, User3]
 *       - name: impostazioniPredefiniteEventi
 *         in: query
 *         description: Oggetto contente tutte le nuove impostazioni predefinite
 *         required: false
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             titolo:
 *              type: string
 *             descrizione:
 *              type: string
 *             durata:
 *              type: integer
 *              minimum: 1
 *             tempAnticNotifica:
 *              type: integer
 *              minimum: 0
 *             luogo:
 *              type: object
 *              properties:
 *               latitudine:
 *                type: number
 *               longitudine:
 *                type: number
 *             priorita:
 *              type: integer
 *              minimum: 1
 *              maximum: 10
 *             difficolta:
 *              type: integer
 *              minimum: 1
 *              maximum: 10
 *         examples:
 *          Compleanno:
 *           summary: Impostazioni per un calendario di compleanni
 *           value:
 *            titolo: "Compleanno"
 *            descrizione: "Compleanno di"
 *            durata: 1440
 *            tempAnticNotifica: 1440
 *            luogo:
 *             latitudine: "12.123123"
 *             longitudine: "13.123123"
 *            priorita: 7
 *            difficolta: 1
 *
 *
 *     responses:
 *       200:
 *         description: Calendario inserito con successo, verrà restituito "Calendar inserted correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Calendar inserted correctly
 *       400:
 *         description: Se manca il nome, verrà restituito "Name missing" <br>Se il colore e' stato passato come parametro ma il formato non e' corretto, verrà restituito "Wrong format for color" <br>Se il il valore GMTOffset del fuso orario non e' valido, verrà ritornato "Wrong format for time zone" <br>Se le impostazioni predefinite non sono valide, verrà restituito "Wrong format impostazioni predefinite"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Manca il nome del calendario
 *             value:
 *              error: Name missing
 *            Errore2:
 *             summary: Formato colore non valido
 *             value:
 *              error: Wrong format for color
 *            Errore3:
 *             summary: Formato del valore GMTOffset non valido
 *             value:
 *              error: Wrong format for time zone
 *            Errore4:
 *             summary: Le impostazioni predefinite non sono valide
 *             value:
 *              error: Wrong format impostazioni predefinite
 *       409:
 *         description: Se manca l'utente con l'userId dato, verrà restituito "There is no user with that userId" <br>Se c'è più di un utente con l'userId dato, verrà restituito "There are too many users with that userId" <br>Se esiste già un calendario principale, verrà ritornato "There are too many primary calendars"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Manca l'utente specificato
 *             value:
 *              error: There is no user with that userId
 *            Errore2:
 *             summary: C'è più di un utente con l'userId specificato
 *             value:
 *              error: There are too many users with that userId
 *            Errore3:
 *             summary: Esiste già un calendario principale
 *             value:
 *              error: There are too many primary calendars
 *       500:
 *         description: Errore di inserimento nel database, verrà restituito "Not inserted" <br/> Se c'e un errore nell'inserimento dei partecipanti, verrà restituito "Error parteciapnti"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *           examples:
 *            Errore1:
 *             summary: Errore di inserimento
 *             value:
 *              error: Not inserted
 *            Errore2:
 *             summary: Errore inserimento partecipanti
 *             value:
 *              error: Error parteciapnti
 *
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
 *   put:
 *     description: Modifica i valori di un calendario dato l'IDCalendario del calendario stesso e gli attributi da modificare
 *     parameters:
 *       - name: userId
 *         in: query
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
 *       - name: nome
 *         in: query
 *         description: Nome del calendario
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Vacanze:
 *           summary: Calendario per le vacanze
 *           value: Vacanze
 *          OrariBiblioteca:
 *           summary: Calendario per gli orari della bibilioteca
 *           value: Orari della biblioteca
 *          Lezioni:
 *           summary: Calendario per le lezioni
 *           value: Lezioni
 *       - name: fusoOrario
 *         in: query
 *         description: Oggetto contente il fuso orario e il capoluogo relativo
 *         required: true
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             GMTOffset:
 *              type: integer
 *              minimum: -12
 *              maximum: 12
 *             localita:
 *              type: string
 *         examples:
 *          Londra:
 *           summary: Fuso orario di Londra
 *           value:
 *            GMTOffset: 0
 *            localita: London
 *          Roma:
 *           summary: Fuso orario di Roma
 *           value:
 *            GMTOffset: 1
 *            localita: Rome
 *          NewYork:
 *           summary: Fuso orario di New York
 *           value:
 *            GMTOffset: -5
 *            localita: New York
 *       - name: colore
 *         in: query
 *         description: Colore con cui verranno visti gli eventi del calendario
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Rosso:
 *           summary: Rosso
 *           value: "#FF0000"
 *          Verde:
 *           summary: Verde
 *           value: "#00FF00"
 *          Blu:
 *           summary: Blu
 *           value: "#0000FF"
 *          Giallo:
 *           summary: Giallo
 *           value: "#FFFF00"
 *          Ciano:
 *           summary: Ciano
 *           value: "#00FFFF"
 *          Magenta:
 *           summary: Magenta
 *           value: "#FF00FF"
 *       - name: partecipanti
 *         in: query
 *         description: Nuova lista dei partecipanti
 *         required: true
 *         schema:
 *          type: array
 *          items:
 *           type: string
 *         examples:
 *          Utente1:
 *           summary: Utente1
 *           value: [User1]
 *          Utente12:
 *           summary: Utente1 e Utente2
 *           value: [User1, User2]
 *          Utente123:
 *           summary: Utente1, Utente2 e Utente3
 *           value: [User1, User2, User3]
 *          Utente13:
 *           summary: Utente1 e Utente3
 *           value: [User1, User3]
 *          Utente23:
 *           summary: Utente2 e Utente3
 *           value: [User2, User3]
 *       - name: impostazioniPredefiniteEventi
 *         in: query
 *         description: Oggetto contente tutte le nuove impostazioni predefinite
 *         required: true
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             titolo:
 *              type: string
 *             descrizione:
 *              type: string
 *             durata:
 *              type: integer
 *              minimum: 1
 *             tempAnticNotifica:
 *              type: integer
 *              minimum: 0
 *             luogo:
 *              type: object
 *              properties:
 *               latitudine:
 *                type: number
 *               longitudine:
 *                type: number
 *             priorita:
 *              type: integer
 *              minimum: 1
 *              maximum: 10
 *             difficolta:
 *              type: integer
 *              minimum: 1
 *              maximum: 10
 *         examples:
 *          Compleanno:
 *           summary: Impostazioni per un calendario di compleanni
 *           value:
 *            titolo: "Compleanno"
 *            descrizione: "Compleanno di"
 *            durata: 1440
 *            tempAnticNotifica: 1440
 *            luogo:
 *             latitudine: "12.123123"
 *             longitudine: "13.123123"
 *            priorita: 7
 *            difficolta: 1
 *
 *     responses:
 *       200:
 *         description: Calendario aggiornato con successo, verrà restituito "Calendar updated correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Calendar updated correctly
 *       400:
 *         description: Se manca uno o più parametri, verrà restituito "Parameter missing" <br>Se il il valore GMTOffset del fuso orario non e' valido, verrà ritornato "Wrong format for time zone"<br>Se il colore e' stato passato come parametro ma il formato non e' corretto, verrà restituito "Wrong format for color" <br>Se le impostazioni predefinite non sono valide, verrà restituito "Wrong format impostazioni predefinite"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Manca un parametro
 *             value:
 *              error: Parameter missing
 *            Errore2:
 *             summary: Formato del valore GMTOffset non valido
 *             value:
 *              error: Wrong format for time zone
 *            Errore3:
 *             summary: Formato colore non valido
 *             value:
 *              error: Wrong format for color
 *            Errore4:
 *             summary: Le impostazioni predefinite non sono valide
 *             value:
 *              error: Wrong format impostazioni predefinite
 *       409:
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verrà restituito "There is no user with that userId" <br>Se e' stato trovato più di un account con lo stesso userId, verrà restituito "There are too many users with that userId" <br>Se non possiedi il calendario, verrà restituito "You do not own the calendar"
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
 *             summary: Non possiedi il calendario
 *             value:
 *              error: You do not own the calendar
 *       500:
 *         description: Errore di modifica nel database, verrà restituito "Not edited"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Not edited
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
 *   delete:
 *     description: Elimina un calendario dato l'IDCalendario
 *     parameters:
 *       - name: userId
 *         in: query
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
 *
 *
 *     responses:
 *       200:
 *         description: Calendario eliminato con successo, verrà restituito "Calendar deleted correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Calendar deleted correctly
 *       400:
 *         description: Manca uno o più parametri, verrà restituito "Parameter missing"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Parameter missing
 *       409:
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verrà restituito "There is no user with that userId" <br>Se e' stato trovato più di un account con lo stesso userId, verrà restituito "There are too many users with that userId" <br>Se non possiedi il calendario, verrà restituito "You do not own the calendar"
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
 *             summary: Non possiedi il calendario
 *             value:
 *              error: You do not own the calendar
 *       500:
 *         description: Errore di eliminazione nel database, verrà restituito "Calendar not deleted"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Calendar not deleted
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

export async function creaCalendario(req, res) {
  await dbConnect();
  try {
    const {
      nome,
      fusoOrario,
      colore,
      principale,
      partecipanti,
      impostazioniPredefiniteEventi,
    } = req.query;
    const { userId } = req.query;

    let arrPartecipanti;

    try {
      arrPartecipanti = JSON.parse(partecipanti);
    } catch (error) {
      arrPartecipanti = partecipanti;
    }

    if (nome == null || userId == null) {
      res.status(400).json({ error: "Name missing" }); //TODO or userID
      return;
    }

    if (colore != null && !/^#([0-9a-f]{3}){1,2}$/i.test(colore)) {
      res.status(400).json({ error: "Wrong format for color" });
      return;
    }

    let tempFusoOrario = null;

    if (fusoOrario != null) {
      try {
        tempFusoOrario = JSON.parse(fusoOrario);
      } catch {
        tempFusoOrario = fusoOrario;
      }

      if (
        tempFusoOrario.GMTOffset == null ||
        tempFusoOrario.localita == null ||
        tempFusoOrario.GMTOffset > 12 ||
        tempFusoOrario.GMTOffset < -12
      ) {
        res.status(400).json({ error: "Wrong format for time zone" });
        return;
      }
    }

    let tempImpostazioniPredefiniteEventi = null;

    if (impostazioniPredefiniteEventi != null) {
      try {
        tempImpostazioniPredefiniteEventi = JSON.parse(
          impostazioniPredefiniteEventi
        );
      } catch {
        tempImpostazioniPredefiniteEventi = impostazioniPredefiniteEventi;
      }
      if (
        tempImpostazioniPredefiniteEventi.titolo == null ||
        tempImpostazioniPredefiniteEventi.descrizione == null ||
        tempImpostazioniPredefiniteEventi.durata == null ||
        tempImpostazioniPredefiniteEventi.tempAnticNotifica == null ||
        tempImpostazioniPredefiniteEventi.luogo == null ||
        tempImpostazioniPredefiniteEventi.luogo.latitudine == null ||
        tempImpostazioniPredefiniteEventi.luogo.longitudine == null ||
        !/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
          tempImpostazioniPredefiniteEventi.luogo.latitudine
        ) ||
        !/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
          tempImpostazioniPredefiniteEventi.luogo.longitudine
        ) ||
        tempImpostazioniPredefiniteEventi.priorita == null ||
        tempImpostazioniPredefiniteEventi.priorita <= 0 ||
        tempImpostazioniPredefiniteEventi.priorita > 10 ||
        tempImpostazioniPredefiniteEventi.difficolta == null ||
        tempImpostazioniPredefiniteEventi.difficolta <= 0 ||
        tempImpostazioniPredefiniteEventi.difficolta > 10 ||
        tempImpostazioniPredefiniteEventi.durata <= 0 ||
        tempImpostazioniPredefiniteEventi.tempAnticNotifica < 0
      ) {
        res
          .status(400)
          .json({ error: "Wrong format impostazioni predefinite" });
        return;
      }
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

    if (principale === "true" || principale == true) {
      const calendariPrincipali = await Calendario.find({
        $and: [{ partecipanti: userId }, { principale: true }],
      });
      if (Object.keys(calendariPrincipali).length >= 1) {
        res.status(409).json({
          error: "There are too many primary calendars",
        });
        return;
      }
    }

    let tempPartecipanti =
      arrPartecipanti != null && Array.isArray(arrPartecipanti)
        ? arrPartecipanti.filter((item) => item !== userId)
        : null;

    await Calendario.create(
      {
        nome: nome,
        fusoOrario: fusoOrario == null ? undefined : tempFusoOrario,
        colore: colore == null ? undefined : colore,
        partecipanti: [userId],
        principale: principale == null ? false : principale,
        impostazioniPredefiniteEventi:
          tempImpostazioniPredefiniteEventi == null
            ? undefined
            : tempImpostazioniPredefiniteEventi,
      },
      function (err, calendar) {
        if (err) {
          res.status(500).json({ error: "Not inserted" });
          return;
        }
        if (tempPartecipanti != null && tempPartecipanti != []) {
          var ObjectId = require("mongoose").Types.ObjectId;
          Calendario.updateMany(
            { _id: new ObjectId(String(calendar._id)) },
            {
              $addToSet: { partecipanti: { $each: tempPartecipanti } },
            },
            function (err) {
              if (err) {
                res.status(500).json({ error: "Error parteciapnti" });
                return;
              }
              res.status(200);
            }
          );
        } else {
          res.status(200);
        }
      }
    );
    if (res.statusCode === 200) {
      res.json({ success: "Calendar inserted correctly" });
    }
    return;
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}

export async function modificaCalendario(req, res) {
  await dbConnect();
  try {
    const {
      IDCalendario,
      nome,
      fusoOrario,
      colore,
      partecipanti,
      impostazioniPredefiniteEventi,
    } = req.query;
    const { userId } = req.query;

    let arrPartecipanti;

    try {
      arrPartecipanti = JSON.parse(partecipanti);
    } catch (error) {
      arrPartecipanti = partecipanti;
    }

    let tempFusoOrario;

    if (fusoOrario != null) {
      try {
        tempFusoOrario = JSON.parse(fusoOrario);
      } catch {
        tempFusoOrario = fusoOrario;
      }
    }
    let tempImpostazioniPredefiniteEventi;

    if (impostazioniPredefiniteEventi != null) {
      try {
        tempImpostazioniPredefiniteEventi = JSON.parse(
          impostazioniPredefiniteEventi
        );
      } catch {
        tempImpostazioniPredefiniteEventi = impostazioniPredefiniteEventi;
      }
    }

    if (
      IDCalendario == null ||
      userId == null ||
      nome == null ||
      fusoOrario == null ||
      tempFusoOrario.GMTOffset == null ||
      tempFusoOrario.localita == null ||
      colore == null ||
      arrPartecipanti == null ||
      impostazioniPredefiniteEventi == null ||
      tempImpostazioniPredefiniteEventi.titolo == null ||
      tempImpostazioniPredefiniteEventi.descrizione == null ||
      tempImpostazioniPredefiniteEventi.durata == null ||
      tempImpostazioniPredefiniteEventi.tempAnticNotifica == null ||
      tempImpostazioniPredefiniteEventi.luogo == null ||
      tempImpostazioniPredefiniteEventi.luogo.latitudine == null ||
      tempImpostazioniPredefiniteEventi.luogo.longitudine == null ||
      tempImpostazioniPredefiniteEventi.priorita == null ||
      tempImpostazioniPredefiniteEventi.difficolta == null
    ) {
      res.status(400).json({ error: "Parameter missing" });
      return;
    }

    if (
      tempFusoOrario.GMTOffset == null ||
      tempFusoOrario.localita == null ||
      tempFusoOrario.GMTOffset > 12 ||
      tempFusoOrario.GMTOffset < -12
    ) {
      res.status(400).json({ error: "Wrong format for time zone" });
      return;
    }

    if (
      tempImpostazioniPredefiniteEventi.titolo == null ||
      tempImpostazioniPredefiniteEventi.descrizione == null ||
      tempImpostazioniPredefiniteEventi.durata == null ||
      tempImpostazioniPredefiniteEventi.tempAnticNotifica == null ||
      tempImpostazioniPredefiniteEventi.luogo == null ||
      tempImpostazioniPredefiniteEventi.luogo.latitudine == null ||
      tempImpostazioniPredefiniteEventi.luogo.longitudine == null ||
      !/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
        tempImpostazioniPredefiniteEventi.luogo.latitudine
      ) ||
      !/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
        tempImpostazioniPredefiniteEventi.luogo.longitudine
      ) ||
      tempImpostazioniPredefiniteEventi.priorita == null ||
      tempImpostazioniPredefiniteEventi.priorita <= 0 ||
      tempImpostazioniPredefiniteEventi.priorita > 10 ||
      tempImpostazioniPredefiniteEventi.difficolta == null ||
      tempImpostazioniPredefiniteEventi.difficolta <= 0 ||
      tempImpostazioniPredefiniteEventi.difficolta > 10 ||
      tempImpostazioniPredefiniteEventi.durata <= 0 ||
      tempImpostazioniPredefiniteEventi.tempAnticNotifica < 0
    ) {
      res.status(400).json({ error: "Wrong format impostazioni predefinite" });
      return;
    }

    if (!/^#([0-9a-f]{3}){1,2}$/i.test(colore)) {
      res.status(400).json({ error: "Wrong format for color" });
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
    if (
      Object.keys(calendariPosseduti).length == 0 ||
      calendariPosseduti[0].partecipanti[0] != userId
    ) {
      res.status(409).json({
        error: "You do not own the calendar",
      });
      return;
    }

    let tempPartecipanti = arrPartecipanti.filter((item) => item !== userId);
    let error = false;

    Calendario.updateMany(
      { _id: new ObjectId(IDCalendario) },
      {
        partecipanti: [userId],
      },
      function (err) {
        if (err) {
          res.status(500).json({ error: "Not edited" });
          return;
        }

        Calendario.updateMany(
          { _id: new ObjectId(IDCalendario) },
          {
            nome: nome,
            fusoOrario: tempFusoOrario,
            colore: colore,
            $addToSet: { partecipanti: { $each: tempPartecipanti } },
            impostazioniPredefiniteEventi: tempImpostazioniPredefiniteEventi,
          },
          function (err) {
            if (err) {
              res.status(500).json({ error: "Not edited" });
              return;
            }

            res.status(200);
          }
        );
      }
    );
    if (res.statusCode === 200) {
      res.json({ success: "Calendar updated correctly" });
    }
    return;
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}

export async function eliminaCalendario(req, res) {
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
    if (
      Object.keys(calendariPosseduti).length == 0 ||
      calendariPosseduti[0].partecipanti[0] != userId
    ) {
      res.status(409).json({
        error: "You do not own the calendar",
      });
      return;
    }

    const deleteCalendar = await Calendario.deleteMany({
      _id: new ObjectId(IDCalendario),
    });

    if (deleteCalendar.deletedCount >= 1) {
      res.status(200).json({ success: "Calendar deleted correctly" });
      return;
    } else {
      res.status(500).json({ error: "Calendar not deleted" });
      return;
    }
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}
