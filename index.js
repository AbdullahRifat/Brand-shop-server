const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxdqwus.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const phonesCollection = client.db('brandShop').collection('phones')
    const phonesCart = client.db('brandShop').collection('phonesCart')

    app.get('/brands',async (req,res)=>{
    
      const cursor =  phonesCollection.find()
      const result = await cursor.toArray()
      res.send(result);

  })

  app.get('/brands/:id', async (req, res) => {
    const phoneId = req.params.id; // Get the ID from the request parameters
    const filter = { _id: new ObjectId(phoneId) }; // Assuming _id is the field that contains the ID

    const phone = await phonesCollection.findOne(filter);
    console.log(phone._id)
   
        res.send(phone);
   
});





    app.post('/phones',async (req,res)=>{
        const newPhone = req.body;
        console.log(newPhone);
        const result = await phonesCollection.insertOne(newPhone)
        res.send(result);

    })
    //adding to my cart
    app.post('/phones/addtocart',async (req,res)=>{
      const newPhone = req.body;
      const result = await phonesCart.insertOne(newPhone)
      res.send(result);

  })
  app.get('/phones/mycart',async (req,res)=>{
    const cursor =  phonesCart.find()
    const result = await cursor.toArray()
    res.send(result);

})

  app.delete('/phones/mycart/delete/:id',async (req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await phonesCart.deleteOne(query)
    res.send(result);
  })

  app.put('/update/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedPhone = req.body;
      console.log(updatedPhone);
  
      const updateDoc = {
        $set: updatedPhone,
      };
  
      const options = { upsert: true };
  
      const result = await phonesCollection.updateOne(filter, updateDoc, options);
  
      res.send(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});