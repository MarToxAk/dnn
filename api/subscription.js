const webpush = require('web-push')
const MongoClient = require('mongodb').MongoClient
import mongoose from 'mongoose';
const { Schema } = mongoose;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});


const blogSchema = new Schema({
  title:  String, // String is shorthand for {type: String}
});


const vapidKeys = {
  publicKey:process.env.PUBLICKEY,
  privateKey: process.env.PRIVATEKEY,
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

const options = {
  vapidDetails: {
    subject: 'mailto:myuserid@email.com',
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey
  },
}

const sendNotification = async (subscription, dataToSend) => {
    try {
    await webpush.sendNotification(subscription, dataToSend, options)
  }
  catch (e) {
    null
  }
}

async function connectToDatabase(uri) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const database = client.db('semana09');
  return database
}


module.exports = async(req, res) => {
  const db = await connectToDatabase(process.env.MONGODB_URI)
  const collection = await db.collection('subscription')

  if (req.method === 'POST') {
    const pushSubscription = req.body
    const subscriptionDB = await collection.findOne({pushSubscription})
    const message = 'Hello World'

    if (!subscriptionDB) {
      const account = await collection.insertOne({pushSubscription});
      const resDB = account.ops[0]
      return res.status(200).send({ error: 'Not User', resDB, subscriptionDB });
    }

    sendNotification(req.body, message)

    res.status(200).json({ message: 'success', subscriptionDB,  pushSubscription})
  } else {
    const Blog = mongoose.model('Blog', blogSchema);

    const tesy = await new Blog({title:'a'}).save()
    console.log(tesy)
    res.status(500).json({ error: 'ERROR!' })

  }
}