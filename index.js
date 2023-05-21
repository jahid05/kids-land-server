const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.o7ebdmy.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const allToysCollection = client.db("ToysCollection").collection("allToys");
    
    // toy collect get api
   
    app.get("/collection", async (req, res) => {
      try {
        const cursor = {}
        const data =  allToysCollection.find(cursor);
        const result = await data.toArray();
        res.send(result);
        console.log(result);
      } 
      catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/toyDetails/:id", async(req, res) =>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await allToysCollection.findOne(query);
        res.send(result);
    })

    app.post("/add-collection", async(req, res) => {
      try {
        const formData = req.body;
        const result = await allToysCollection.insertOne(formData);
        res.send(result);
      } catch (error) {
        console.log(error);
      }

    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HELLO KIDS");
});

app.listen(port, () => {
  console.log(`Kids land server is running: ${port}`);
});
