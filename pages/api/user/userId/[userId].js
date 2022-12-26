import dbConnect from "../../../../lib/dbConnect";
import UtenteAutenticato from "../../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "GET") {
    getUser(req, res);
  }
}

/**
 * @swagger
 * /api/user/userId/{userId}:
 *   get:
 *     description: Ritorna userId, email, username di un utente dato l'userId
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
 *         description: Manca il parametro, verra restituito "Parameter missing"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Parameter missing
 *       409:
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verra restituito "There is no user with that userId" <br>Se e' stato trovato piu di un account con lo stesso userId, verra restituito "There are too many users with that userId"
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

    res.status(200).json({
      userId: users[0].userId,
      email: users[0].email,
      username: users[0].username,
    });
    return;
  } catch (e) {
    console.error(e);
    res.status(501).json({ error: "Generic error" });
    throw new Error(e).message;
  }
}
