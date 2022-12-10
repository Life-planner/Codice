import clientPromise from "../../../../lib/mongodb";

export default function handler(req, res) {
  if (req.method === "GET") {
    getUser(req, res);
  }
}

/**
 * @swagger
 * /api/user/email/[email]:
 *   get:
 *     description: Ritorna userId, email, username di un utente dato l'email
 *     parameters:
 *       - name: email
 *         in: path
 *         description: Email
 *         required: true
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
 *               example: qwerasdfvxzcvz
 *             email:
 *               type: string
 *               example: prova@prova.it
 *             username:
 *               type: string
 *               example: ilMostro
 *       202 :
 *         description: Se e' stato trovato piu di un account con la stessa email, verra restituito "More than one user with that email" <br>Se non e' stato trovato nessun account con l'email, verra restituito "No such user"
 *         content:
 *          application/json:
 *           schema:
 *            oneOf:
 *             - $ref: '#/components/schemas/troppiUser'
 *             - $ref: '#/components/schemas/nessunUser'
 *           examples:
 *            troppiUser:
 *             summary: Piu di un utente con la stessa enail
 *             value:
 *              error: More than one user with that email
 *            nessunUser:
 *             summary: Nessun utente con l'email indicata
 *             value:
 *              error: No such user
 *       500:
 *         description: error di connessione al database, verra restituito "Connection error"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Connection error
 * components:
 *  schemas:
 *    troppiUser:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *    nessunUser:
 *      type: object
 *      properties:
 *        error:
 *          type: string
 */

async function getUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const { email } = req.query;
    const emailDB = await collection.find({ email: email }).toArray();

    if (Object.keys(emailDB).length == 1) {
      res.status(200).json({
        userId: emailDB[0].userId,
        email: emailDB[0].email,
        username: emailDB[0].username,
      });
    } else if (Object.keys(emailDB).length > 1) {
      res.status(202).json({ error: "More than one user with that email" });
    } else {
      res.status(202).json({ error: "No such user" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Connection error" });
    throw new Error(e).message;
  }
}
