const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config()

app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
    `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.u69fsfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();

        const userCollections = client.db('userDB').collection('users');


        app.get('/users', async(req, res) => {
            const result = await userCollections.find().toArray();
            res.send(result);
        })

        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await userCollections.findOne(query);
            res.send(result);
        })

        app.post('/users', async(req, res) => {
            const doc = req.body;
            console.log(doc);
            const result = await userCollections.insertOne(doc);
            res.send(result);
        })

        app.delete("/users/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await userCollections.deleteOne(query);
            res.send(result);
        })

        app.put("/users/:id", async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const user = req.body;

            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    id: user.id
                }
            }
            const result = await userCollections.updateOne(filter, updatedUser,  options)
            res.send(result)

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
    res.send("Server is open");
});

app.listen(port, () => {
    console.log("server is running");
});
