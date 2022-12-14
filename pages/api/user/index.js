import dbConnect from "../../../lib/dbConnect";
import UtenteAutenticato from "../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "POST") {
    creaUser(req, res);
  } else if (req.method === "PUT") {
    modificaUser(req, res);
  } else if (req.method === "DELETE") {
    eliminaUser(req, res);
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
 *       - name: email
 *         in: query
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
 *       - name: username
 *         in: query
 *         description: Username
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Username1:
 *           summary: Username1
 *           value: Username1
 *          Username2:
 *           summary: Username2
 *           value: Username2
 *          Username3:
 *           summary: Username3
 *           value: Username3
 *
 *     responses:
 *       200:
 *         description: Utente inserito con successo, verrà restituito "User inserted correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: User inserted correctly
 *       400:
 *         description: Manca uno o piu parametri, verrà restituito "Parameter missing"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Parameter missing
 *       409:
 *         description: Se e' stato trovato piu di un account con la stessa email o userId, verrà restituito "There is already one user with that id or email"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: There is alrady one user with that id or email
 *       500:
 *         description: Errore di inserimento nel database, verrà restituito "Not inserted"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             error:
 *               type: string
 *               example: Not inserted
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
 *   put:
 *     description: Modifica l'username di un utente dato l'userId e il nuovo username
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
 *       - name: username
 *         in: query
 *         description: Username
 *         required: true
 *         schema:
 *          type: string
 *         examples:
 *          Username1:
 *           summary: Username1
 *           value: Username1
 *          Username2:
 *           summary: Username2
 *           value: Username2
 *          Username3:
 *           summary: Username3
 *           value: Username3
 *
 *     responses:
 *       200:
 *         description: Username aggiornato con successo, verrà restituito "User updated correctly"
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             success:
 *               type: string
 *               example: User updated correctly
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
 *         description: Se non e' stato trovato neanche un account con l'userId dato, verrà restituito "There is no user with that userId" <br>Se e' stato trovato più di un account con lo stesso userId, verrà restituito "There are too many users with that userId"
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
 */

export async function creaUser(req, res) {
  await dbConnect();
  try {
    const { userId, email, username } = req.query;

    if (userId == null || email == null || username == null) {
      res.status(400).json({ error: "Parameter missing" });
      return;
    }

    const users = await UtenteAutenticato.find({
      $or: [{ userId: userId }, { email: email }],
    });
    if (Object.keys(users).length >= 1 || /[, \\%=]/gm.test(userId)) {
      res
        .status(409)
        .json({ error: "There is alrady one user with that id or email" });
      return;
    }

    UtenteAutenticato.create(
      {
        userId: userId,
        email: email,
        username: username,
      },
      function (err) {
        if (err) {
          res.status(500).json({ error: "Not inserted" });
          return;
        }
        res.status(200);
      }
    );
    if (res.statusCode === 200) {
      res.json({ success: "User inserted correctly" });
    }
    return;
  } catch (e) {
    res.status(501).json({ error: "Generic error" });
    return;
  }
}

export async function modificaUser(req, res) {
  await dbConnect();
  try {
    const { userId, username } = req.query;

    if (userId == null || username == null) {
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

    const put = await UtenteAutenticato.updateMany(
      { userId: userId },
      { $set: { username: username } }
    );

    if (put.modifiedCount == 1) {
      res.status(200).json({ success: "User updated correctly" });
    } else {
      res.status(500).json({ error: "Not edited" });
    }
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}

export async function eliminaUser(req, res) {
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

    const deleteUser = await UtenteAutenticato.deleteMany({ userId: userId });

    if (deleteUser.deletedCount >= 1) {
      res.status(200).json({ success: "User deleted correctly" });
      return;
    } else {
      res.status(500).json({ error: "User not deleted" });
      return;
    }
  } catch (e) {
    
    res.status(501).json({ error: "Generic error" });
    return;
  }
}
