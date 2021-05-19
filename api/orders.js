// Import Dependencies
const { MongoClient, ObjectID } = require("mongodb");

async function connectToDatabase(uri) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db('semana09');
    return database
}

// The main, exported, function of the endpoint,
// dealing with the request and subsequent response
module.exports = async(req, res) => {
    const database = await connectToDatabase(process.env.MONGODB_URI)
    const collection = database.collection('orders');
    const collection2 = database.collection('orderend');



    async function getSequenceNextValue() {
      const count = await collection.countDocuments()
      const count2 = await collection2.countDocuments()
      return count + count2 + 1
    }
  
    async function getSequenceToDay(){
      const count = await collection.find({created: { '$eq': new Date().toLocaleString('pt-BR', {   timeZone: 'America/Sao_Paulo', year: 'numeric', month: 'numeric', day: 'numeric'})}}).count()
      const count2 = await collection2.find({created: { '$eq': new Date().toLocaleString('pt-BR', {   timeZone: 'America/Sao_Paulo', year: 'numeric', month: 'numeric', day: 'numeric'})}}).count()
      return count + count2 +1
    }

    var date = new Date()
    var now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    const date2 = new Date(now_utc)
    //date = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);

    if (req.method === 'POST') {
    const { _id, total, pedido, finalizar, name, telephone, _rowVariant, selectedaddress, status, statusclient } = req.body;

      var order = await collection.insertOne({
          pedido,
          name,
          telephone,
          nPedido: await getSequenceNextValue(),
          nPedidoToDay: await getSequenceToDay(),
          created: date2.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          users: new ObjectID(_id),
          dt: date2.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          total: total,
          finalizar,
          selectedaddress,
          _rowVariant, 
          status,
          statusclient
          })
          const index = await collection.countDocuments()-1
      order = order.ops[0]

      //const opp = await collection.find({}).toArray()
      res.status(200).json({ order, index })
    } else {
      console.log(req.query.table)
      if(req.query.table === '1'){
        const object = await collection.find({}).toArray()
        res.status(200).json({ object })
      } else if(req.query.table === '2'){
        const object = await collection2.find({}).toArray()
        res.status(200).json({ object })
      }
      else{
        res.status(201).json({ error: 'No Query' })
      }
  }
    
}