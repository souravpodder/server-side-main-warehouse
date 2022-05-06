const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

    // get a single item 
    app.get('/item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemsCollection.findOne(query);
      // console.log(item);
      res.send(item);
    })

    //update quantity 
    app.put(`/updatequantity/:id`, async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      console.log(updatedQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          quantity: updatedQuantity.quantity
        }

      }

      const result = await itemsCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    }
    )

    // delete a single item 
    app.delete('/item/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
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
