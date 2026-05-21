require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.dnimeu3.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let  Bockingcolection;

async function run() {
  try {
      
    await client.connect();
    const db = client.db("drivefeltest");
    Bockingcolection = db.collection("feltest");
    const productsCollection = db.collection("feltest")
     
    app.get('/feltest',async(req,res) =>  {
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })
       app.get('/feltest/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id:new ObjectId(id) }
        const result = await productsCollection.findOne(query);
        res.send(result)
    })
   app.post("/feltest", async (req, res) => {
  console.log(req.body, "from ami");
  

  const result = await productsCollection.insertOne(req.body);
  res.send(result); 
});

app.patch("/feltest/:id", async(req,res) => {
  const {id} = req.params;
  const updateData = req.body;
  
  const filter = { _id:new ObjectId(id)};
  const updateDoc = {
    $set:{
      ...updateData,
    },
  };
  const result = await productsCollection.updateOne(filter,updateDoc);
  res.send(result);
})

app.post("/feltest", async (req, res) => {
  const bookingData = req.body;
  const result = await bookingsCollection.insertOne(bookingData);
  res.send(result);
});


app.get("/feltest", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).send({ message: "Email query parameter is required" });
    }
    const query = { userEmail: email };
    const result = await bookingsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server Error" });
  }
});




app.delete("/feltest/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Product ID received:", productId);

   
   const query = { _id: new ObjectId(productId)};
    
   
    const result = await productsCollection.deleteOne(query);
    console.log("Delete result:", result);

    
    res.send(result);
  } catch (error) {
    console.error("Backend Error inside delete:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});
app.post("/feltest",async(req,res) =>{
  const bookingData = req.body;
  const result = await Bockingcolection.insertOne(bookingData);
  res.json(result)
})




  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello world!');
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
