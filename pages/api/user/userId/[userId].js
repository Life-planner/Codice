import clientPromise from "../../../../lib/mongodb";

export default function handler(req, res) {
  if (req.method === "GET") {
    getUser(req, res);
  }
}

/**
 * @swagger
 * /api/user/userId/[userId]:
 *   get:
 *     description: Ritorna userId, email, username di un utente dato l'userId
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: User ID
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
 *         description: Se e' stato trovato piu di un account con lo stesso userId, verra restituito "More than one user with that id" <br>Se non e' stato trovato nessun account con l'userId trovato, verra restituito "No such user"
 *         content:
 *          application/json:
 *           schema:
 *            oneOf:
 *             - $ref: '#/components/schemas/troppiUser'
 *             - $ref: '#/components/schemas/nessunUser'
 *           examples:
 *            troppiUser:
 *             summary: Piu di un utente con lo stesso userId
 *             value:
 *              error: More than one user with that id
 *            nessunUser:
 *             summary: Nessun utente con l'userId indicato
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

    const { userId } = req.query;
    const user = await collection.find({ userId: userId }).toArray();

    if (Object.keys(user).length == 1) {
      res.status(200).json({
        userId: user[0].userId,
        email: user[0].email,
        username: user[0].username,
      });
    } else if (Object.keys(user).length > 1) {
      res.status(202).json({ error: "More than one user with that id" });
    } else {
      res.status(202).json({ error: "No such user" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Connection error" });
    throw new Error(e).message;
  }
}
