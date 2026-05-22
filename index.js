require('dotenv').config(); 
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
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


let productsCollection;
let bookingsCollection;

async function run() {
  try {
    await client.connect();
    const db = client.db("drivefeltest");
    
  
    productsCollection = db.collection("feltest");
    bookingsCollection = db.collection("bookings");
     
    
    app.get('/feltest', async (req, res) => {
        try {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    
    app.get('/feltest/:id', async (req, res) => {
        try {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid ID format" });
            }
            const query = { _id: new ObjectId(id) };
            const result = await productsCollection.findOne(query);
            
            if (!result) {
                return res.status(404).json({ success: false, message: "NOT FOUND ANY DATA" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("SINGLE DATA GET ERROR:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

   
    app.post("/feltest", async (req, res) => {
        try {
            console.log(req.body, "from ami");
            const result = await productsCollection.insertOne(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

   
    app.post("/feltest/bookings", async (req, res) => {
        try {
            const bookingData = req.body;
            const result = await bookingsCollection.insertOne(bookingData);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    app.put("/feltest/:id", async (req, res) => {
        try {
            const id = req.params.id; 
            const updatedData = req.body; 
            
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, message: "Invalid ID format" });
            }
            
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    title: updatedData.title,
                    type: updatedData.type,
                    status: updatedData.status,
                    pricePerDay: parseFloat(updatedData.pricePerDay), 
                    image: updatedData.image,
                    description: updatedData.description,
                    location: updatedData.location,
                    totalSeats: parseInt(updatedData.totalSeats) 
                },
            };

            const result = await productsCollection.updateOne(filter, updateDoc);
            res.status(200).json(result);
        } catch (error) {
            console.error("Update Error:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

  
    app.delete("/feltest/:id", async (req, res) => {
      try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        const query = { _id: new ObjectId(productId) };
        const result = await productsCollection.deleteOne(query);
        res.status(200).json(result);
      } catch (error) {
        console.error("Backend Error inside delete:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is live!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});