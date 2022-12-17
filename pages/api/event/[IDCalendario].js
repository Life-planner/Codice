import dbConnect from "../../../lib/dbConnect";
import Calendario from "../../../models/Calendario";
import Evento from "../../../models/Evento";
import UtenteAutenticato from "../../../models/UtenteAutenticato";

export default function handler(req, res) {
  if (req.method === "GET") {
    getCalendari(req, res);
  }
}

/**
 * @swagger
 * /api/event/{IDCalendario}:
 *   get:
 *     
 */

async function getCalendari(req, res) {
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
