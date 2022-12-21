import clientPromise from "../lib/mongodb";
import dbConnect from "../lib/dbConnect";
import UtenteAutenticato from "./Calendario";
import Calendario from "./Calendario";
import Evento from "./Calendario";

export async function cancellaTutto() {
  await dbConnect();
  for (let model of [UtenteAutenticato, Calendario, Evento]) {
    try {
      await model.collection.drop();
    } catch (e) {
    if (e.code >= 0 || e.code < 0) {
    } else {
      throw e;
    }
    }
  }
}
/**
 * Cancella la tabella UtenteAutenticato
 * Poi crea un utente con:
 *  userId: "UtenteProva1"
 *  useremail: "UtenteProva1"
 *  username: "UtenteProva1"
 */
export async function cancellaTuttoUtente() {
  const client = await clientPromise;
  const db = client.db("test");

  let tabelle = db.listCollections().toArray(function (err, collInfos) {
    if (!err) {
      collInfos.forEach((i) => {
        if (i.name == "UtenteAutenticato") {
          try {
            db.collection(i.name).drop();
          } catch (err) {
            if (err.message !== "ns not found") {
              throw err;
            }
          }
        }
      });
    }
  });
}
/**
 * Cancella la tabella Calenario
 */
export async function cancellaTuttoCalendario() {
  await dbConnect();

  try {
    await Calendario.collection.drop();
  } catch (e) {
    if (e.code >= 0 || e.code < 0) {
    } else {
      throw e;
    }
  }

  return;
}
/**
 * Cancella la tabella Evento
 */
export async function cancellaTuttoEvento() {
  await dbConnect();

  try {
    await Evento.collection.drop();
  } catch (e) {
    if (e.code >= 0 || e.code < 0) {
    } else {
      throw e;
    }
  }

  return;
}
