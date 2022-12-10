import clientPromise from "../../../lib/mongodb";

export default function handler(req, res) {
  if (req.method === "POST") {
    postUser(req, res);
  } else if (req.method === "PUT") {
    putUser(req, res);
  } else if (req.method === "DELETE") {
    deleteUser(req, res);
  }
}

/**
 * @swagger
 * /api/user/:
 *   post:
 *     description: Crea un utente dati userId, email, e username
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: UserId
 *         required: true
 *       - name: email
 *         in: query
 *         description: Email
 *         required: true
 *       - name: username
 *         in: query
 *         description: Username
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Utente inserito con successo, verra restituito "User inserted correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: User inserted correctly
 *       202 :
 *         description: Se e' stato trovato piu di un account con la stessa email o userId, verra restituito "There is alrady one user with that id or email" <br>Se non e' stato inserito l'utente verra restituito "Not inserted"
 *         content:
 *          application/json:
 *           schema:
 *            oneOf:
 *             - $ref: '#/components/schemas/utenteGiaEsistente'
 *             - $ref: '#/components/schemas/erroreInserimento'
 *           examples:
 *            utenteGiaEsistente:
 *             summary: Esiste gia un utente con l'userId o email
 *             value:
 *              error: There is alrady one user with that id or email
 *            erroreInserimento:
 *             summary: Utente non inserito
 *             value:
 *              error: Not inserted
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
 *   put:
 *     description: Ritorna userId, email, username di un utente dato l'email
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: UserId
 *         required: true
 *       - name: username
 *         in: query
 *         description: Username
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Sostituisce l'username dell'account, viene restituito "User updated correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: User updated correctly
 *       202 :
 *         description: Se il record non viene modificato, oppure piu di un record viene modificato, viene restituito "Not inserted"<br>
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: Not edited
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
 *   delete:
 *     description: Elimina un utente dato l'userId
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: UserId
 *         required: true
 *
 *     responses:
 *       200:
 *         description: Utente eliminato correttamente
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: User deleted correctly
 *       202 :
 *         description: Se e' stato trovato piu di un account con la stessa email, verra restituito "More than one user with that email" <br>Se non e' stato trovato nessun account con l'email, verra restituito "No such user"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: User not deleted
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
 */

async function postUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const { userId, email, username } = req.query;

    const user = await collection
      .find({ $or: [{ userId: userId }, { email: email }] })
      .toArray();

    if (Object.keys(user).length >= 1) {
      res
        .status(202)
        .json({ error: "There is alrady one user with that id or email" });
    } else {
      const post = await collection.insertOne({
        userId: userId,
        email: email,
        username: username,
      });
      if (post.insertedCount == 1) {
        res.status(200).json({ success: "User inserted correctly" });
      } else {
        res.status(202).json({ error: "Not inserted" });
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Connection error" });
    throw new Error(e).message;
  }
}

async function putUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    // In caso si volesse cambiare anche la mail

    const { userId, /*email,*/ username } = req.query;
    /*const emailCheck = await collection.find({ email: email }).toArray();
    if (Object.keys(emailCheck).length > 1) {
      res
        .status(202)
        .json({ error: "There is alrady one user with that email" });
    } else if (Object.keys(emailCheck).length == 0) {*/
    const put = await collection.updateMany(
      { userId: userId },
      //{ $set: {email: email, username: username } },
      { $set: { username: username } },
    );

    if (put.result.nModified == 1) {
      res.status(200).json({ success: "User updated correctly" });
    } else {
      res.status(202).json({ error: "Not edited" });
    }
    //}
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Connection error" });
    throw new Error(e).message;
  }
}

async function deleteUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const { userId } = req.query;
    const deleteUser = await collection.remove({ userId: userId });

    if (deleteUser.result.n >= 1) {
      res.status(200).json({ success: "User deleted correctly" });
    } else {
      res.status(202).json({ error: "User not deleted" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Connection error" });
    throw new Error(e).message;
  }
}
