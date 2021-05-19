// Import Dependencies
const MongoClient = require('mongodb').MongoClient

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
    const collection = await db.collection('districts')


    if (req.method === 'POST') { // Get a database connection, cached or otherwise,
        // using the connection string environment variable as the argument
        const { district, price } = req.body;

        // Select the "users" collection from the database
        const districts = await collection.findOne({ district: district })

        if (!districts) {
            const account = await collection.insertOne({ district, price })

            return res.status(200).json({
                account,
            })

        }

        // Respond with a JSON string of all streets in the collection

        res.status(200).json({
            district,
            body: req.body,
            headers: req.headers,
            query: req.query,
            cookies: req.cookies,
        })
    } else {
        const district = await collection.find({}).toArray()
        res.status(200).json({ district })
    }
}