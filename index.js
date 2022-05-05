const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6bnyi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();

    const itemsCollection = client.db("sportsGearDB").collection("items");
    console.log('connected to sports gear db');

    // get all the datas
    app.get('/items', async (req, res) => {
      const query = req.query;
      // console.log(query);

      const cursor = itemsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

  } finally {

  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('inverntory server is running....');
})

app.listen(port, () => {
  console.log('listening to port', port);
})
