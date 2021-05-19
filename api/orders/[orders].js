// Import Dependencies
const { MongoClient, ObjectID } = require("mongodb");
const jwt = require('jsonwebtoken');


async function connectToDatabase(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('semana09');

    return database
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async(req, res) => {
  /*
    jwt.verify(req.headers.authorization,  process.env.SEGREDO, function(err, decoded) {
      if (err) res.status(401).json({ err })  // Manage different errors here (Expired, untrusted...)
       // If no error, token info is returned in 'decoded'
      decoded
      
    });
    */
    const database = await connectToDatabase(process.env.MONGODB_URI)
    const collection = database.collection('orders');
    const collection2 = database.collection('orderend');
    const {orders} = req.query;

    if (req.method === 'POST') {       
      res.status(200).json({ 'Error': "Solicitação não autorizada" })
    } 
    else if (req.method === 'PATCH'){

      const id = new ObjectID(orders)
      var teste = await collection.updateOne({_id: id}, {$set:req.body})
      res.status(200).json({ teste })
    }
    else if (req.method === 'PUT'){

      const id = new ObjectID(orders)
      console.log('put ' + id)
      var copy2del = await collection.findOne({_id: id})
      console.log(copy2del)

      var resp = await collection2.insertOne(copy2del);
      await collection.deleteOne(copy2del);
      res.status(200).json({ resp })
    }
    else if (req.method === 'GET') {
      const id = new ObjectID(orders)
      const object = await collection.findOne({_id: id})      //object = object.ops[0]
      res.status(200).json({ object })
  }
    
}