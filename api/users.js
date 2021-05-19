// Import Dependencie
const { MongoClient, ObjectID } = require("mongodb");

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
    const collection = await db.collection('users')


    if (req.method === 'POST') { // Get a database connection, cached or otherwise,
        const users = await collection.findOne({ telephone: req.body.telephone })
        
        if (!users) {
            
            const account = await collection.insertOne(req.body);
            const users = account.ops[0]
            return res.status(200).json({
                users
            })
        }

        // Respond with a JSON string of all users in the collection

        res.status(200).json({
            users
        })
    } else if (req.method === 'PATCH') { // Get a database connection, cached or otherwise,
        var {id} = req.query;
        // using the connection string environment variable as the argument
        
        const valDistrict = await db.collection('districts').findOne({district: req.body.district})
        
        const valStreet = await db.collection('streets').findOne({street: req.body.street})
        
        //var taxaMotoboy = 0
        var taxaMotoboy = Math.max((!valDistrict ? 0 : valDistrict.price), (!valStreet ? 0 : valStreet.price))

        id = new ObjectID(id)
        req.body.taxaMotoboy = taxaMotoboy
        await collection.update({_id: id}, {$push:{address: req.body}})
        const users = await collection.findOne({ _id: id })
        res.status(200).json({ users })
    }
    else {
        const users = await collection.find({}).toArray()
        res.status(200).json({ users })
    }
}