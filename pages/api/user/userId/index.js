import clientPromise from "../../../../lib/mongodb";

export default function handler(req, res) {
  if (req.method === 'POST') {
    postUser(req, res);
  }else if (req.method === 'PUT') {
    putUser(req, res);
  }else if (req.method === 'DELETE') {
    deleteUser(req, res);
  }

}

async function postUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const {userId, email, username} = req.query

    const user = await collection.find({userId: parseInt(userId)}).toArray();

    if(Object.keys(user).length >= 1){
      res.status(204).json({ error: "There is alrady one user with that id" })
    }else{

        const post = await collection.insertOne({
            userId: parseInt(userId),
            email: email,
            username: username
        });

        res.status(200).json(post);    
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({error: "Connessione al server fallita"}); 
    throw new Error(e).message;
  }  
}

async function putUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const {userId, email, username} = req.query;
    const emailCheck = await collection.find({email: email}).toArray();

    if(Object.keys(emailCheck).length > 1){
      res.status(204).json({ error: "There is alrady one user with that email" })
    }else if(Object.keys(emailCheck).length == 0){

        const user = await collection.update({userId: parseInt(userId)}, {$set: {email: email, username: username}});

        res.status(200).json(post);   
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({errore: "Connessione al server fallita"}); 
    throw new Error(e).message;
  }  
}

async function deleteUser(req, res) {
  try {
    const client = await clientPromise;
    const collection = client.db("PlanIt").collection("user");

    const {userId} = req.query;
    const user = await collection.remove({userId: parseInt(userId)});

    res.status(200).json({ user })

  } catch (e) {
    console.error(e);
    res.status(500).json({errore: "Connessione al server fallita"}); 
    throw new Error(e).message;
  }  
}