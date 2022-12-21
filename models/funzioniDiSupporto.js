import clientPromise from "../lib/mongodb";

export async function cancellaTutto() {
  const client = await clientPromise;
  const db = client.db("test");

  let tabelle = await db.listCollections().toArray(function (err, collInfos) {
    if (!err) {
      collInfos.forEach((i) => {
        db.collection(i.name).drop();
      });
    }
  });
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

  let tabelle = await db.listCollections().toArray(function (err, collInfos) {
    if (!err) {
      collInfos.forEach((i) => {
        if(i.name == "UtenteAutenticato"){
          db.collection(i.name).drop();
        }
      });
    }
  });
}
/**
 * Cancella la tabella Calenario
 */
export async function cancellaTuttoCalendario() {
  const client = await clientPromise;
  const db = client.db("test");

  let tabelle = await db.listCollections().toArray(function (err, collInfos) {
    if (!err) {
      collInfos.forEach((i) => {
        if(i.name == "Calendario"){
          db.collection(i.name).drop();
        }
      });
    }
  });
}
/**
 * Cancella la tabella Evento
 */
export async function cancellaTuttoEvento() {
  const client = await clientPromise;
  const db = client.db("test");

  let tabelle = await db.listCollections().toArray(function (err, collInfos) {
    if (!err) {
      collInfos.forEach((i) => {
        if(i.name == "Evento"){
          db.collection(i.name).drop();
        }
      });
    }
  });
}
