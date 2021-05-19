const crypto = require("crypto");
const MongoClient = require('mongodb').MongoClient
const jwt = require('jsonwebtoken');

async function connectToDatabase(uri) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const database = client.db('semana09');
  return database
}


module.exports = async(req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const collection = await db.collection('usersAdmin')
  var {password, userLogin} = req.body

  password = crypto.pbkdf2Sync(password, process.env.SEGREDO,  
    1000, 64, `sha512`).toString(`hex`);

  if (req.method === 'POST') {

    
    const usersAdmin = await collection.findOne({ user: userLogin })
    

    if (!usersAdmin) {
      return res.status(401).send({ error: 'Not User' });
    }
    if(password === usersAdmin.password){
      const token = jwt.sign({ id:usersAdmin._id }, process.env.SEGREDO, {
        expiresIn: 720 // expires in 5min
      });
      return res.status(200).json({ auth: true, token: token })
    }
    else{
      return res.status(401).send({ error: 'Not Password' });
    }
  } else {
    const users = await collection.find({}).toArray()
    res.status(200).json({ users })
  }
}