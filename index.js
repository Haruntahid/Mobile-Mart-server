const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// tahidtaha997
// T5pULcAbOdogev8J

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jc69b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const mobileCollection = client.db("mobileMart").collection("all-mobiles");

    // get all mobiles
    app.get("/mobiles", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 6;
      const search = req.query.search || "";
      const sort = req.query.sort || "";

      console.log(sort);

      let query = {};
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      // Sorting options based on the sort parameter
      let sortOption = {};
      if (sort === "price-asc") {
        sortOption = { price: 1 }; // Sort by price low to high
      } else if (sort === "price-desc") {
        sortOption = { price: -1 }; // Sort by price high to low
      } else if (sort === "date-asc") {
        sortOption = { dateAdded: 1 }; // Sort by oldest first
      } else if (sort === "date-desc") {
        sortOption = { dateAdded: -1 }; // Sort by newest first
      }

      const totalMobiles = await mobileCollection.countDocuments(query); // Corrected total count based on search
      const mobiles = await mobileCollection
        .find(query)
        .sort(sortOption)
        .skip(page * size) // Adjusted for zero-based page
        .limit(size)
        .toArray();

      res.send({
        mobile: mobiles,
        totalCount: totalMobiles,
      });
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON PORT ${port}`);
});
