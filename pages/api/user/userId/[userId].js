import clientPromise from "../../../../lib/mongodb";

export default function handler(req, res) {
  if (req.method === 'GET') {
    getUser(req, res);
  }

}

async function getUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const {userId} = req.query;
    const user = await collection.find({userId: parseInt(userId)}).toArray();

    if(Object.keys(user).length == 1){
      res.status(200).json({ userId: user[0].userId, email: user[0].email , username: user[0].username })
    }else if(Object.keys(user).length > 1){
      res.status(204).json({ error: "More than one user with that id" })
    }else{
      res.status(204).json({ error: "No such user" })
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({errore: "Connessione al server fallita"}); 
    throw new Error(e).message;
  }  

}
