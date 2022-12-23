import dbConnect from "../../../../lib/dbConnect";
import UtenteAutenticato from "../../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "GET") {
    getUser(req, res);
  }
}

/**
 * @swagger
 * /api/user/email/{email}:
 *   get:
 *     description: Ritorna userId, email, username di un utente data l'email
 *     parameters:
 *       - name: email
 *         in: path
 *         description: Email
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Email1:
 *           summary: Email1
 *           value: "prova@example.com"
 *          Email2:
 *           summary: Email2
 *           value: "prova@studenti.unitn.it"
 *          Email3:
 *           summary: Email3
 *           value: "prova@gmail.com"
 *
 *     responses:
 *       200:
 *         description: Trovato un unico account, verra restituito userId, email e username
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             userId:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *               pattern: '!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/'
 *             username:
 *               type: string
 *           examples:
 *            Esempio1:
 *             summary: Esempio1
 *             value: 
 *              userId: Utente1
 *              email: prova@example.com
 *              username: Username1
 *            Esempio2:
 *             summary: Esempio2
 *             value: 
 *              userId: Utente2
 *              email: prova@studenti.unitn.it
 *              username: Username2
 *       400:
 *         description: Manca la mail o il formato non e' corretto, verra restituito "Parameter missing or malformed"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Parameter missing or malformed
 *       409:
 *         description: Se non e' stato trovato neanche un account con l'email data, verra restituito "There is no user with that email" <br>Se e' stato trovato piu di un account con la stessa email, verra restituito "There are too many users with that email"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *              type: string
 *           examples:
 *            Errore1:
 *             summary: Neanche un utente con l'email specificata
 *             value:
 *              error: There is no user with that email
 *            Errore2:
 *             summary: Piu utenti con la stessa email
 *             value:
 *              error: There are too many users with that email
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
 */

export async function getUser(req, res) {
  await dbConnect();
  try {
    const { email } = req.query;

    if (
      email == null ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
      res.status(400).json({ error: "Parameter missing or malformed" });
      return;
    }

    const emailDB = await UtenteAutenticato.find({
      email: email,
    });

    if (Object.keys(emailDB).length == 0) {
      res.status(409).json({ error: "There is no user with that email" });
      return;
    } else if (Object.keys(emailDB).length > 1) {
      res
        .status(409)
        .json({ error: "There are too many users with that email" });
      return;
    }

    res.status(200).json({
      userId: emailDB[0].userId,
      email: emailDB[0].email,
      username: emailDB[0].username,
    });
    return;
  } catch (e) {
    console.error(e);
    res.status(501).json({ error: "Generic error" });
    throw new Error(e).message;
  }
}
