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

    const {email} = req.query;
    const emailDB = await collection.find({email: email}).toArray();
    
    if(Object.keys(emailDB).length == 1){
      res.status(200).json({ userId: emailDB[0].userId , email: emailDB[0].email, username: emailDB[0].username })
    }else if(Object.keys(emailDB).length > 1){
      res.status(204).json({ error: "More than one user with that email" })
    }else{
      res.status(204).json({ error: "No such user" })
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({errore: "Connessione al server fallita"}}); 
    throw new Error(e).message;
  }  

}