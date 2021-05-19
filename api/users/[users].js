// Import Dependencies
const { MongoClient, ObjectID } = require("mongodb");


async function connectToDatabase(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('semana09');
    const collection = database.collection('users');
    return collection
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async(req, res) => {
    const collection = await connectToDatabase(process.env.MONGODB_URI)
    const {users} = req.query;
    console.log(users)

    if (req.method === 'POST') {       
      res.status(200).json({ 'Error': "Solicitação não autorizada" })
    } else {
      const id = new ObjectID(users)
      const object = await collection.findOne({_id: id})      //object = object.ops[0]
      res.status(200).json({ object })
  }
    
}