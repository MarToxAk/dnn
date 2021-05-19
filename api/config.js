// Import Dependencie
const {MongoClient, ObjectID} = require('mongodb')

// Create cached connection variable

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('semana09');
    return database
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async(req, res) => {
    const db = await connectToDatabase(process.env.MONGODB_URI)
    const collection = await db.collection('config')


    if (req.method === 'POST') { // Get a database connection, cached or otherwise,
        // using the connection string environment variable as the argument
        var { ip, print } = req.body;

        const config = await collection.findOne({_id: ObjectID('606245464df0e742108adb31')})
        if (!config) {
            const account = await collection.insertOne({ ip, print });
            const config = account.ops[0]
            return res.status(200).json({
                config
            })
        }

        // Respond with a JSON string of all users in the collection

        res.status(200).json({
          config
        })
    }
    else if (req.method === 'PATCH'){

        const id = new ObjectID('606245464df0e742108adb31')
        var teste = await collection.updateOne({_id: id}, {$set:req.body})
        res.status(200).json({ teste })
      } 
    else {
        const config = await collection.findOne({_id: ObjectID('606245464df0e742108adb31')})
        res.status(200).json({ config })
    }
}