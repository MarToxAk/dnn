const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});


const GroupSchema = new mongoose.Schema({
  nome: String,
});

const Group = mongoose.model('Group', GroupSchema);


const ProductSchema = new mongoose.Schema({
  nome: String,
  preco: String,
  preco2: String,
  ingredientes: [String],
  imagem: String,
  activated: Boolean,
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }
  // String is shorthand for {type: String}
});
const Product = mongoose.model('Product', ProductSchema);



module.exports = async(req, res) => {
  const {product} = req.query;
  console.log(product)

  if (req.method === 'GET') {
    if(product === 'all'){
      const find = await Product.find({}).populate('group').exec();

      res.status(200).json(find)
    } else{
      try {
        const find = await Product.findOne({_id: product}).populate('group');

        res.status(200).json(find)
      } catch {
        res.status(200).json({ product })
      }
    }
  }
  if (req.method === 'POST') {
    if(product === 'new'){
      const {nome, preco, preco2, ingredientes, imagem, activated, group} = req.body

      const check = await Product.findOne({nome}).populate('group');
      console.log(check)
      
      if(!check){
        const criado = await Product.create({
          nome,
          preco,
          preco2,
          ingredientes: ingredientes.split(',').map(ingredientes => ingredientes.trim()),
          imagem,
          activated,
          group,
        })
        await criado.populate('group').execPopulate();
        return res.status(200).json({ criado })
      }
      
      return res.status(200).json({ check })
      
     
      
    } else if (product === 'group') { 
      const {nome} = req.body
      console.log(nome) 
      const criado = await Group.create({nome})
      return res.status(200).json({ criado })
    }   
  }
  if (req.method === 'PUT') {       
    res.status(200).json({ product })
  }
  if (req.method === 'PATCH') {    
    try {
      const find = await Product.updateOne({_id: product}, {$set:req.body});

      res.status(200).json(find)
    } catch {
      res.status(200).json({ product })
    }
  }
  if (req.method === 'DELETE') {   
      try {
        const find = await Product.deleteOne({_id: product});
        res.status(200).json(find)
      } catch {
        res.status(200).json({ product })
      }
  }
  if (req.method === 'OPTIONS') {       
    res.status(200).json({ product })
  }
  if (req.method === 'HEAD') {
    res.status(200).json({ product })
  }


}