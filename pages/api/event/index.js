import dbConnect from "../../../lib/dbConnect";
import Evento from "../../../models/Evento";
import Calendario from "../../../models/Calendario";
import UtenteAutenticato from "../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "POST") {
    creaEvento(req, res);
  } else if (req.method === "PUT") {
    modificaEvento(req, res);
  } else if (req.method === "DELETE") {
    eliminaEvento(req, res);
  }
}

/**
 * @swagger
 * /api/event/:
 *   post:
 *     description: Crea un evento dati userId, IDCalendario, il titolo, la descrizione, il luogo, la priorita, la difficolta, i partecipanti, le impostazioni per le notifiche, la durata, se e' un evnto singolo e in quel caso i valori per eventoSingolo, altrimenti i valori per eventoRipetuto,
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
 *         description: Id del calendario all'interno del DataBase
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
 *       - name: titolo
 *         in: query
 *         description: Titolo dell evento
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Calcio:
 *           summary: Partita di calcio
 *           value: Partita Francia-Marocco
 *          Lezione:
 *           summary: Lezione Ingegneria del Software
 *           value: Lezione Ingegneria del Software
 *          Appuntamento:
 *           summary: Appuntamento clienti
 *           value: Appuntamento con Azienda X
 *       - name: descrizione
 *         in: query
 *         description: Descrizione dell'evento
 *         required: false
 *         schema:
 *          type: string
 *         examples:
 *          Calcio:
 *           summary: Partita di calcio
 *           value: Partita Francia-Marocco secondo me vince Francia
 *          Lezione:
 *           summary: Lezione Ingegneria del Software
 *           value: Argomenti trattati \n- MongoDB
 *          Appuntamento:
 *           summary: Appuntamento clienti
 *           value: Argomenti di discussione \n- Punti deboli \n- Come migliorare la strategia \n- Aumentare profitti
 *       - name: luogo
 *         in: query
 *         description: Nome del calendario
 *         required: false
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             latitudine:
 *              type: number
 *             longitudine:
 *              type: number
 *         examples:
 *          Calcio:
 *           summary: Posizione partita Francia Marocco
 *           value:
 *            latitudine: 25.652291
 *            longitudine: 51.487782
 *          Lezione:
 *           summary: Posizione Università
 *           value:
 *            latitudine: 46.068244
 *            longitudine: 11.150163
 *          Appuntamento:
 *           summary: Posizione appuntamento
 *           value:
 *            latitudine: 40.348201
 *            longitudine: 9.493751
 *       - name: priorita
 *         in: query
 *         description: Priorità dell'evento
 *         required: false
 *         schema:
 *          type: number
 *         examples:
 *          basso:
 *           summary: Priorità bassa
 *           value: 1
 *          medio:
 *           summary: Priorità media
 *           value: 5
 *          alto:
 *           summary: Priorità alta
 *           value: 10
 *       - name: difficolta
 *         in: query
 *         description: Difficoltà dell'evento
 *         required: false
 *         schema:
 *          type: number
 *         examples:
 *          basso:
 *           summary: Difficoltà bassa
 *           value: 1
 *          medio:
 *           summary: Difficoltà media
 *           value: 5
 *          alto:
 *           summary: Difficolta alta
 *           value: 10
 *       - name: partecipanti
 *         in: query
 *         description: Lista dei partecipanti
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
 *       - name: notifiche
 *         in: query
 *         description: Oggetto contente le impostazioni per le notifiche
 *         required: false
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             titolo:
 *              type: string
 *             data:
 *              type: [date]
 *         examples:
 *          Calcio:
 *           summary: Partita tra poco
 *           value:
 *            titolo: Partita tra poco
 *            data: [1671189531689, 1671189532689]
 *          Lezione:
 *           summary: Lezione tra poco
 *           value:
 *            titolo: Lezione tra poco
 *            data: [1671189531689]
 *          Appuntamento:
 *           summary: Appuntamento tra poco
 *           value:
 *            titolo: Appuntamento tra poco
 *            data: [1671194251689]
 *       - name: durata
 *         in: query
 *         description: Durata dell'evento
 *         required: false
 *         schema:
 *          type: number
 *         examples:
 *          basso:
 *           summary: Durata 10 min
 *           value: 10
 *          medio:
 *           summary: Durata 1h
 *           value: 60
 *          alto:
 *           summary: Durata 1 giorno
 *           value: 1440
 *       - name: isEventoSingolo
 *         in: query
 *         description: Valore booleano che identifica se e' un evento singolo o evento ripetuto
 *         required: true
 *         schema:
 *          type: boolean
 *         examples:
 *          singolo:
 *           summary: Evento singolo
 *           value: true
 *          ripetuto:
 *           summary: Evento ripetuto
 *           value: false
 *       - name: eventoSingolo
 *         in: query
 *         description: Oggetto contente le impostazioni per l'eventoSingolo
 *         required: false
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             data:
 *              type: date
 *             isScadenza:
 *              type: boolean
 *         examples:
 *          Calcio:
 *           summary: Orario della partita
 *           value:
 *            data: 1671189531689
 *            isScadenza: true
 *          Lezione:
 *           summary: orario della lezione
 *           value:
 *            data: 1671189531689
 *            isScadenza: false
 *          Appuntamento:
 *           summary: Orario dell'appuntamento
 *           value:
 *            data: 1671194251689
 *            isScadenza: false
 *       - name: eventoRipetuto
 *         in: query
 *         description: Oggetto contente le impostazioni per l'eventoRipetuto
 *         required: false
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             numeroRipetizioni:
 *              type: number
 *             impostazioniAvanzate:
 *              type: object
 *              properties:
 *               giorniSettimana:
 *                type: [string]
 *               data:
 *                type: date
 *         examples:
 *          Partite:
 *           summary: Orario delle partite di calcetto
 *           value:
 *            numeroRipetizioni: 5
 *            impostazioniAvanzate:
 *             giorniSettimana: ["Sabato", "Domenica"]
 *             data: 1671194251689
 *          Lezione:
 *           summary: Orario delle lezioni
 *           value:
 *            numeroRipetizioni: 20
 *            impostazioniAvanzate:
 *             giorniSettimana: ["Lunedi", "Mercoledi"]
 *             data: 1671194251689
 *          Appuntamento:
 *           summary: Orario degli appuntamenti
 *           value:
 *            numeroRipetizioni: 5
 *            impostazioniAvanzate:
 *             giorniSettimana: ["Mercoledi"]
 *             data: 1671194253689
 *
 *     responses:
 *       200:
 *         description: Evento inserito con successo, verrà restituito "Event inserted correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Event inserted correctly
 *       400:
 *         description: Se manca uno o più dei seguoenti IDCalendario, nome, titolo, isEventoSingolo oppure uno dei due tra eventoSingolo ed eventoRipetuto verrà restituito "IDCalendario or titolo or evento details missing" <br>Se la posizione e' stata passata come parametro ma il formato non e' corretto, verrà restituito "Wrong format for location" <br>Se la priorità e' stata passata come parametro ma il valore non e' corretto, verrà restituito "Wrong format for priorita" <br>Se la difficolta e' stata passata come parametro ma il valore non e' corretto, verrà restituito "Wrong format for difficolta" <br>Se le impostazioni notifiche sono state passate come parametro ma il valore non e' corretto, verrà restituito "Wrong format for notifiche" <br>Se la durata e' stata passata come parametro ma il valore non e' corretto, verrà restituito "Wrong format for durata" <br>Se le informazioni di un evento singolo sono state passate come parametro ma il valore non e' corretto, verrà restituito "Wrong format for eventoSingolo" <br>Se le informazioni di un evento ripetuto sono state passate come parametro ma il valore non e' corretto, verrà restituito "Wrong format for eventoRipetuto"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Manca un parametro obbligatorio
 *             value:
 *              error: IDCalendario or titolo or evento details missing
 *            Errore2:
 *             summary: Parametro posizione non valido
 *             value:
 *              error: Wrong format for location
 *            Errore3:
 *             summary: Parametro priorità non valido
 *             value:
 *              error: Wrong format for priorita
 *            Errore4:
 *             summary: Parametro difficoltà non valido
 *             value:
 *              error: Wrong format for difficolta
 *            Errore5:
 *             summary: Parametro impostazioni notifiche non valido
 *             value:
 *              error: Wrong format for notifiche
 *            Errore6:
 *             summary: Parametro durata non valido
 *             value:
 *              error: Wrong format for durata
 *            Errore7:
 *             summary: Parametro eventoSingolo non valido
 *             value:
 *              error: Wrong format for eventoSingolo
 *            Errore8:
 *             summary: Parametro eventoRipetuto non valido
 *             value:
 *              error: Wrong format for eventoRipetuto
 *       409:
 *         description: Se manca l'utente con l'userId dato, verrà restituito "There is no user with that userId" <br>Se c'è più di un utente con l'userId dato, verrà restituito "There are too many users with that userId" <br>Se manca un calendario con il IDCalendario oppure l'utente non possiede il calendario specificato, verrà ritornato "There is no calendar with that ID or you do not own the calendar"
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
 *             summary: Non esiste il calendario indicato o l'utente che lo ha richiesto non lo e
 *             value:
 *              error: There is no calendar with that ID or you do not own the calendar
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
 *
 *   put:
 *     description: Modifica un evento dati userId, IDEvento, IDCalendario, il titolo, la descrizione, il luogo, la priorità, la difficoltà, i partecipanti, le impostazioni per le notifiche, la durata, se e' un evento singolo e in quel caso i valori per eventoSingolo, altrimenti i valori per eventoRipetuto,
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
 *       - name: IDEvento
 *         in: query
 *         description: Id dell'evento all'interno del DataBase
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
 *       - name: IDCalendario
 *         in: query
 *         description: Id del calendario all'interno del DataBase
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
 *       - name: titolo
 *         in: query
 *         description: Titolo dell evento
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Calcio:
 *           summary: Partita di calcio
 *           value: Partita Francia-Marocco
 *          Lezione:
 *           summary: Lezione Ingegneria del Software
 *           value: Lezione Ingegneria del Software
 *          Appuntamento:
 *           summary: Appuntamento clienti
 *           value: Appuntamento con Azienda X
 *       - name: descrizione
 *         in: query
 *         description: Descrizione dell'evento
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Calcio:
 *           summary: Partita di calcio
 *           value: Partita Francia-Marocco secondo me vince Francia
 *          Lezione:
 *           summary: Lezione Ingegneria del Software
 *           value: Argomenti trattati \n- MongoDB
 *          Appuntamento:
 *           summary: Appuntamento clienti
 *           value: Argomenti di discussione \n- Punti deboli \n- Come miglirare la strategia \n- Aumentare profitti
 *       - name: luogo
 *         in: query
 *         description: Nome del calendario
 *         required: true
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             latitudine:
 *              type: number
 *             longitudine:
 *              type: number
 *         examples:
 *          Calcio:
 *           summary: Posizione partita Francia Marocco
 *           value:
 *            latitudine: 25.652291
 *            longitudine: 51.487782
 *          Lezione:
 *           summary: Posizione Università
 *           value:
 *            latitudine: 46.068244
 *            longitudine: 11.150163
 *          Appuntamento:
 *           summary: Posizione appuntamento
 *           value:
 *            latitudine: 40.348201
 *            longitudine: 9.493751
 *       - name: priorita
 *         in: query
 *         description: Priorità dell'evento
 *         required: true
 *         schema:
 *          type: number
 *         examples:
 *          basso:
 *           summary: Priorità bassa
 *           value: 1
 *          medio:
 *           summary: Priorità media
 *           value: 5
 *          alto:
 *           summary: Priorità alta
 *           value: 10
 *       - name: difficolta
 *         in: query
 *         description: Difficoltà dell'evento
 *         required: true
 *         schema:
 *          type: number
 *         examples:
 *          basso:
 *           summary: Difficoltà bassa
 *           value: 1
 *          medio:
 *           summary: Difficoltà media
 *           value: 5
 *          alto:
 *           summary: Difficoltà alta
 *           value: 10
 *       - name: partecipanti
 *         in: query
 *         description: Lista dei partecipanti
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
 *       - name: notifiche
 *         in: query
 *         description: Oggetto contente le impostazioni per le notifiche
 *         required: true
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             titolo:
 *              type: string
 *             data:
 *              type: [date]
 *         examples:
 *          Calcio:
 *           summary: Partita tra poco
 *           value:
 *            titolo: Partita tra poco
 *            data: [1671189531689, 1671189532689]
 *          Lezione:
 *           summary: Lezione tra poco
 *           value:
 *            titolo: Lezione tra poco
 *            data: [1671189531689]
 *          Appuntamento:
 *           summary: Appuntamento tra poco
 *           value:
 *            titolo: Appuntamento tra poco
 *            data: [1671194251689]
 *       - name: durata
 *         in: query
 *         description: Durata dell'evento
 *         required: true
 *         schema:
 *          type: number
 *         examples:
 *          basso:
 *           summary: Durata 10 min
 *           value: 10
 *          medio:
 *           summary: Durata 1h
 *           value: 60
 *          alto:
 *           summary: Durata 1 giorno
 *           value: 1440
 *       - name: isEventoSingolo
 *         in: query
 *         description: Valore booleano che identifica se e' un evento singolo o evento ripetuto
 *         required: true
 *         schema:
 *          type: boolean
 *         examples:
 *          singolo:
 *           summary: Evento singolo
 *           value: true
 *          ripetuto:
 *           summary: Evento ripetuto
 *           value: false
 *       - name: eventoSingolo
 *         in: query
 *         description: Oggetto contente le impostazioni per l'eventoSingolo
 *         required: true
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             data:
 *              type: date
 *             isScadenza:
 *              type: boolean
 *         examples:
 *          Calcio:
 *           summary: Orario della partita
 *           value:
 *            data: 1671189531689
 *            isScadenza: true
 *          Lezione:
 *           summary: orario della lezione
 *           value:
 *            data: 1671189531689
 *            isScadenza: false
 *          Appuntamento:
 *           summary: Orario dell'appuntamento
 *           value:
 *            data: 1671194251689
 *            isScadenza: false
 *       - name: eventoRipetuto
 *         in: query
 *         description: Oggetto contente le impostazioni per l'eventoRipetuto
 *         required: true
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             numeroRipetizioni:
 *              type: number
 *             impostazioniAvanzate:
 *              type: object
 *              properties:
 *               giorniSettimana:
 *                type: [string]
 *               data:
 *                type: date
 *         examples:
 *          Partite:
 *           summary: Orario delle partite di calcetto
 *           value:
 *            numeroRipetizioni: 5
 *            impostazioniAvanzate:
 *             giorniSettimana: ["Sabato", "Domenica"]
 *             data: 1671194251689
 *          Lezione:
 *           summary: Orario delle lezioni
 *           value:
 *            numeroRipetizioni: 20
 *            impostazioniAvanzate:
 *             giorniSettimana: ["Lunedi", "Mercoledi"]
 *             data: 1671194251689
 *          Appuntamento:
 *           summary: Orario degli appuntamenti
 *           value:
 *            numeroRipetizioni: 5
 *            impostazioniAvanzate:
 *             giorniSettimana: ["Mercoeldi"]
 *             data: 1671194253689
 *
 *     responses:
 *       200:
 *         description: Evento modificato con successo, verrà restituito "Event edited correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Event edited correctly
 *       400:
 *         description: Se manca uno o più dei seguenti userId, IDCalendario, titolo, descrizione, luogo, priorita, difficolta, partecipanti, notifiche durata isEventoSingolo oppure uno dei due tra eventoSingolo ed eventoRipetuto verrà restituito "Parameter missing" <br>Se il formato della posizione non e' corretto, verrà restituito "Wrong format for location" <br>Se il formato della priorita non e' corretto, verrà restituito "Wrong format for priorita" <br>Se il formato della difficolta non e' corretto, verrà restituito "Wrong format for difficolta" <br>Se il formato delle impostazioni notifiche non e' corretto, verrà restituito "Wrong format for notifiche" <br>Se il formato della durata non e' corretto, verrà restituito "Wrong format for durata" <br>Se il formato delle informazioni di un evento singolo  non e' corretto, verrà restituito "Wrong format for eventoSingolo" <br>Se il formato delle informazioni di un evento ripetuto non e' corretto, verrà restituito "Wrong format for eventoRipetuto"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Manca un parametro obbligatorio
 *             value:
 *              error: Parameter missing
 *            Errore2:
 *             summary: Parametro posizione non valido
 *             value:
 *              error: Wrong format for location
 *            Errore3:
 *             summary: Parametro priorita non valido
 *             value:
 *              error: Wrong format for priorita
 *            Errore4:
 *             summary: Parametro difficolta non valido
 *             value:
 *              error: Wrong format for difficolta
 *            Errore5:
 *             summary: Parametro impostazioni notifiche non valido
 *             value:
 *              error: Wrong format for notifiche
 *            Errore6:
 *             summary: Parametro durata non valido
 *             value:
 *              error: Wrong format for durata
 *            Errore7:
 *             summary: Parametro eventoSingolo non valido
 *             value:
 *              error: Wrong format for eventoSingolo
 *            Errore8:
 *             summary: Parametro eventoRipetuto non valido
 *             value:
 *              error: Wrong format for eventoRipetuto
 *       409:
 *         description: Se manca l'utente con l'userId dato, verrà restituito "There is no user with that userId" <br>Se c'è più di un utente con l'userId dato, verrà restituito "There are too many users with that userId" <br>Se manca un calendario con il IDCalendario oopure l'utente non possiede il calendario specificato, verrà ritornato "There is no calendar with that ID or you do not own the calendar" <br>Se manca l'evento con l'IDEvento oopure l'utente non possiede l'evento specificato, verrà ritornato "You do not own the event"
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
 *             summary: Non esiste il calendario indicato o l'utente che lo ha richiesto non lo e
 *             value:
 *              error: There is no calendar with that ID or you do not
 *            Errore4:
 *             summary: Non esiste l'evento o l'utente che lo ha richiesto non lo possiede
 *             value:
 *              error: You do not own the event
 *       500:
 *         description: Errore di inserimento nel database, verrà restituito "Not modified"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Not modified
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
 *
 *   delete:
 *     description: Elimina un evento dati userId, IDCalendario
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
 *       - name: IDEvento
 *         in: query
 *         description: Id dell'evento all'interno del DataBase
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
 *     responses:
 *       200:
 *         description: Evento eliminato con successo, verrà restituito "Event deleted correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Event deleted correctly
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
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verrà restituito "There is no user with that userId" <br>Se e' stato trovato più di un account con lo stesso userId, verrà restituito "There are too many users with that userId" <br>Se non possiedi l'evento, verrà restituito "You do not own the event"
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
 *             summary: Non possiedi l'evento
 *             value:
 *              error: You do not own the event
 *       500:
 *         description: Errore di eliminazione nel database, verrà restituito "Event not deleted"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Event not deleted
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

export async function creaEvento(req, res) {
  await dbConnect();
  try {
    const {
      IDCalendario,
      titolo,
      descrizione,
      luogo,
      priorita,
      difficolta,
      partecipanti,
      notifiche,
      durata,
      isEventoSingolo,
      eventoSingolo,
      eventoRipetuto,
    } = req.query;
    const { userId } = req.query;

    let arrPartecipanti;
    try {
      arrPartecipanti = JSON.parse(partecipanti);
    } catch (error) {
      arrPartecipanti = partecipanti;
    }
    if (
      IDCalendario == null ||
      titolo == null ||
      userId == null ||
      isEventoSingolo == null ||
      (isEventoSingolo == true && eventoSingolo == null) ||
      (isEventoSingolo == false && eventoRipetuto == null)
    ) {
      res
        .status(400)
        .json({ error: "IDCalendario or titolo or evento details missing" }); //TODO or userID
      return;
    }

    let tempLuogo;
    if (luogo != null) {
      try {
        tempLuogo = JSON.parse(luogo);
      } catch {
        tempLuogo = luogo;
      }
      if (
        tempLuogo.latitudine == null ||
        tempLuogo.longitudine == null ||
        !/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
          tempLuogo.latitudine
        ) ||
        !/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
          tempLuogo.longitudine
        )
      ) {
        res.status(400).json({ error: "Wrong format for location" });
        return;
      }
    }
    if (priorita != null && (priorita <= 0 || priorita > 10)) {
      res.status(400).json({ error: "Wrong format for priorita" });
      return;
    }
    if (difficolta != null && (difficolta <= 0 || difficolta > 10)) {
      res.status(400).json({ error: "Wrong format for difficolta" });
      return;
    }
    let tempNotifiche;
    if (notifiche != null) {
      try {
        tempNotifiche = JSON.parse(notifiche);
      } catch {
        tempNotifiche = notifiche;
      }

      if (tempNotifiche.titolo == null || tempNotifiche.data == null) {
        res.status(400).json({ error: "Wrong format for notifiche" });
        return;
      }
    }
    if (durata != null && durata <= 0) {
      res.status(400).json({ error: "Wrong format for durata" });
      return;
    }

    let tempEvento;

    if (isEventoSingolo) {
      if (eventoSingolo != null) {
        try {
          tempEvento = JSON.parse(eventoSingolo);
        } catch {
          tempEvento = eventoSingolo;
        }
        if (tempEvento.data == null || tempEvento.isScadenza == null) {
          res.status(400).json({ error: "Wrong format for eventoSingolo" });
          return;
        }
        tempEvento.data = new Date(tempEvento.data);
      }
    } else {
      if (eventoRipetuto != null) {
        try {
          tempEvento = JSON.parse(eventoRipetuto);
        } catch {
          tempEvento = eventoRipetuto;
        }
        if (
          tempEvento.numeroRipetizioni == null ||
          tempEvento.impostazioniAvanzate == null ||
          tempEvento.impostazioniAvanzate.giorniSettimana == null ||
          tempEvento.impostazioniAvanzate.data == null ||
          tempEvento.numeroRipetizioni < 1 ||
          tempEvento.impostazioniAvanzate.giorniSettimana == []
        ) {
          res.status(400).json({ error: "Wrong format for eventoRipetuto" });
          return;
        }

        tempEvento.impostazioniAvanzate.data = new Date(tempEvento.data);
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

    var ObjectId = require("mongoose").Types.ObjectId;

    const calendariPosseduti = await Calendario.find({
      $and: [{ partecipanti: userId }, { _id: new ObjectId(IDCalendario) }],
    });
    if (
      Object.keys(calendariPosseduti).length == 0 ||
      calendariPosseduti[0].partecipanti[0] != userId
    ) {
      res.status(409).json({
        error:
          "There is no calendar with that ID or you do not own the calendar",
      });
      return;
    }

    let tempPartecipanti =
      arrPartecipanti != null && Array.isArray(arrPartecipanti)
        ? arrPartecipanti.filter((item) => item !== userId)
        : calendariPosseduti[0].partecipanti.filter((item) => item !== userId);

    if (isEventoSingolo) {
      await Evento.create(
        {
          IDCalendario: IDCalendario,
          titolo: titolo,
          descrizione: descrizione == null ? undefined : descrizione,
          luogo: luogo == null ? undefined : tempLuogo,
          priorita: priorita == null ? undefined : priorita,
          difficolta: difficolta == null ? undefined : difficolta,
          partecipanti: [userId],
          notifiche: notifiche == null ? undefined : tempNotifiche,
          durata: durata == null ? undefined : durata,
          isEventoSingolo: true,
          eventoSingolo: tempEvento,
        },
        function (err, event) {
          if (err) {
            res.status(500).json({ error: "Not inserted" });
            return;
          }
          if (tempPartecipanti != null && tempPartecipanti != []) {
            var ObjectId = require("mongoose").Types.ObjectId;
            Evento.updateMany(
              { _id: new ObjectId(String(event._id)) },
              {
                $addToSet: { partecipanti: { $each: tempPartecipanti } },
              },
              function (err) {
                if (err) {
                  res.status(500).json({ error: "Error parteciapnti" });
                  return;
                }
                res.status(200);
                return;
              }
            );
          } else {
            res.status(200);
            return;
          }
        }
      );
    } else {
      Evento.create(
        {
          IDCalendario: IDCalendario,
          titolo: titolo,
          descrizione: descrizione == null ? undefined : descrizione,
          luogo: luogo == null ? undefined : tempLuogo,
          priorita: priorita == null ? undefined : priorita,
          difficolta: difficolta == null ? undefined : difficolta,
          partecipanti: [userId],
          notifiche: notifiche == null ? undefined : tempNotifiche,
          durata: durata == null ? undefined : durata,
          isEventoSingolo: false,
          eventoRipetuto: tempEvento,
        },
        function (err, event) {
          if (err) {
            res.status(500).json({ error: "Not inserted" });
            return;
          }
          if (tempPartecipanti != null && tempPartecipanti != []) {
            var ObjectId = require("mongoose").Types.ObjectId;
            Evento.updateMany(
              { _id: new ObjectId(String(event._id)) },
              {
                $addToSet: { partecipanti: { $each: tempPartecipanti } },
              },
              function (err) {
                if (err) {
                  res.status(500).json({ error: "Error parteciapnti" });
                  return;
                }
                res.status(200);
                return;
              }
            );
          } else {
            res.status(200);
            return;
          }
        }
      );
    }
    if (res.statusCode === 200) {
      res.json({ success: "Event inserted correctly" });
    }
    return;
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}

export async function modificaEvento(req, res) {
  await dbConnect();
  try {
    const {
      IDEvento,
      IDCalendario,
      titolo,
      descrizione,
      luogo,
      priorita,
      difficolta,
      partecipanti,
      notifiche,
      durata,
      isEventoSingolo,
      eventoSingolo,
      eventoRipetuto,
    } = req.query;
    const { userId } = req.query;

    let arrPartecipanti;

    try {
      arrPartecipanti = JSON.parse(partecipanti);
    } catch (error) {
      arrPartecipanti = partecipanti;
    }

    let tempLuogo;
    if (luogo != null) {
      try {
        tempLuogo = JSON.parse(luogo);
      } catch {
        tempLuogo = luogo;
      }
    }
    let tempNotifiche;
    if (notifiche != null) {
      try {
        tempNotifiche = JSON.parse(notifiche);
      } catch {
        tempNotifiche = notifiche;
      }
    }
    let tempEvento;
    if (isEventoSingolo) {
      if (eventoSingolo != null) {
        try {
          tempEvento = JSON.parse(eventoSingolo);
        } catch {
          tempEvento = eventoSingolo;
        }
      }
    } else {
      if (eventoRipetuto != null) {
        try {
          tempEvento = JSON.parse(eventoRipetuto);
        } catch {
          tempEvento = eventoRipetuto;
        }
      }
    }

    if (
      IDEvento == null ||
      IDCalendario == null ||
      titolo == null ||
      userId == null ||
      isEventoSingolo == null ||
      (isEventoSingolo == true && eventoSingolo == null) ||
      (isEventoSingolo == false && eventoRipetuto == null) ||
      descrizione == null ||
      luogo == null ||
      arrPartecipanti == null ||
      priorita == null ||
      difficolta == null ||
      notifiche == null ||
      durata == null
    ) {
      res.status(400).json({ error: "Parameter missing" });
      return;
    }

    if (priorita <= 0 || priorita > 10) {
      res.status(400).json({ error: "Wrong format for priorita" });
      return;
    }
    if (difficolta <= 0 || difficolta > 10) {
      res.status(400).json({ error: "Wrong format for difficolta" });
      return;
    }

    if (durata <= 0) {
      res.status(400).json({ error: "Wrong format for durata" });
      return;
    }

    if (
      tempLuogo.latitudine == null ||
      tempLuogo.longitudine == null ||
      !/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
        tempLuogo.latitudine
      ) ||
      !/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
        tempLuogo.longitudine
      )
    ) {
      res.status(400).json({ error: "Wrong format for location" });
      return;
    }
    if (tempNotifiche.titolo == null || tempNotifiche.data == null) {
      res.status(400).json({ error: "Wrong format for notifiche" });
      return;
    }

    if (isEventoSingolo) {
      if (eventoSingolo != null) {
        if (tempEvento.data == null || tempEvento.isScadenza == null) {
          res.status(400).json({ error: "Wrong format for eventoSingolo" });
          return;
        }
      }
    } else {
      if (eventoRipetuto != null) {
        if (
          tempEvento.numeroRipetizioni == null ||
          tempEvento.impostazioniAvanzate == null ||
          tempEvento.impostazioniAvanzate.giorniSettimana == null ||
          tempEvento.impostazioniAvanzate.data == null ||
          tempEvento.numeroRipetizioni < 1 ||
          tempEvento.impostazioniAvanzate.giorniSettimana == []
        ) {
          res.status(400).json({ error: "Wrong format for eventoRipetuto" });
          return;
        }
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
    var ObjectId = require("mongoose").Types.ObjectId;

    const evento = await Evento.find({
      _id: new ObjectId(IDEvento),
      partecipanti: userId,
    });
    if (
      Object.keys(evento).length == 0 ||
      evento[0].partecipanti[0] != userId
    ) {
      res.status(409).json({
        error: "You do not own the event",
      });
      return;
    }

    const calendario = await Calendario.find({
      _id: new ObjectId(IDCalendario),
      partecipanti: userId,
    });
    if (
      Object.keys(calendario).length == 0 ||
      calendario[0].partecipanti[0] != userId
    ) {
      res.status(409).json({
        error:
          "There is no calendar with that ID or you do not own the calendar",
      });
      return;
    }

    let tempPartecipanti = arrPartecipanti.filter((item) => item !== userId);
    let error = false;

    Evento.updateMany(
      { _id: new ObjectId(IDEvento) },
      {
        partecipanti: [userId],
      },
      function (err) {
        if (err) {
          res.status(500).json({ error: "Not modified" });
          return;
        }

        if (isEventoSingolo) {
          Evento.updateMany(
            { _id: new ObjectId(IDEvento) },
            {
              IDCalendario: IDCalendario,
              titolo: titolo,
              descrizione: descrizione,
              luogo: tempLuogo,
              priorita: priorita,
              difficolta: difficolta,
              $addToSet: { partecipanti: { $each: tempPartecipanti } },
              notifiche: tempNotifiche,
              durata: durata,
              isEventoSingolo: true,
              eventoSingolo: tempEvento,
            },
            function (err) {
              if (err) {
                res.status(500).json({ error: "Not modified" });
                return;
              }
              res.status(200);
            }
          );
        } else {
          Evento.updateMany(
            { _id: new ObjectId(IDEvento) },
            {
              IDCalendario: IDCalendario,
              titolo: titolo,
              descrizione: descrizione,
              luogo: tempLuogo,
              priorita: priorita,
              difficolta: difficolta,
              $addToSet: { partecipanti: { $each: tempPartecipanti } },
              notifiche: tempNotifiche,
              durata: durata,
              isEventoSingolo: false,
              eventoRipetuto: tempEvento,
            },
            function (err) {
              if (err) {
                res.status(500).json({ error: "Not modified" });
                return;
              }
              res.status(200);
            }
          );
        }
      }
    );
    if (res.statusCode === 200) {
      res.json({ success: "Event edited correctly" });
    }
    return;
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}

export async function eliminaEvento(req, res) {
  await dbConnect();
  try {
    const { IDEvento } = req.query;
    const { userId } = req.query;

    if (IDEvento == null || userId == null) {
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

    const eventiPosseduti = await Evento.find({
      $and: [{ partecipanti: userId }, { _id: new ObjectId(IDEvento) }],
    });
    if (
      Object.keys(eventiPosseduti).length == 0 ||
      eventiPosseduti[0].partecipanti[0] != userId
    ) {
      res.status(409).json({
        error: "You do not own the event",
      });
      return;
    }

    const deleteEvent = await Evento.deleteMany({
      _id: new ObjectId(IDEvento),
    });

    if (deleteEvent.deletedCount >= 1) {
      res.status(200).json({ success: "Event deleted correctly" });
      return;
    } else {
      res.status(500).json({ error: "Event not deleted" });
      return;
    }
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}
