import Calendario from "./Calendario";
import Evento from "./Evento";
import UtenteAutenticato from "./UtenteAutenticato";
import clientPromise from "../lib/mongodb";
import dbConnect from "../lib/dbConnect";

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
