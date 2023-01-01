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

export async function cancellaTuttoUtente() {
  await dbConnect();

  try {
    await UtenteAutenticato.collection.drop();
  } catch (e) {
    if (e.code >= 0 || e.code < 0) {
    } else {
      throw e;
    }
  }

  await UtenteAutenticato.create(
    {
      userId: "utenteTestProvaDuplicato",
      email: "utenteTestProvaDuplicato@unitn.it",
      username: "utenteTestProvaDuplicato",
    },
    function (err, user) {}
  );

  await UtenteAutenticato.create(
    {
      userId: "utenteTestProvaDuplicato",
      email: "utenteTestProvaDuplicato@unitn.it",
      username: "utenteTestProvaDuplicato",
    },
    function (err, user) {}
  );

  return;
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
