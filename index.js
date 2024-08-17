const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mobile-mart-d9ffe.web.app",
    ],
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
      const brands = req.query.brands || "";
      const categories = req.query.categories || "";
      const minPrice = parseFloat(req.query.minPrice) || 0;
      const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;

      // Sorting options based on the sort parameter
      let sortOption = {};
      if (sort === "price-asc") {
        sortOption = { price: 1 };
      } else if (sort === "price-desc") {
        sortOption = { price: -1 };
      } else if (sort === "date-asc") {
        sortOption = { dateAdded: 1 };
      } else if (sort === "date-desc") {
        sortOption = { dateAdded: -1 };
      }

      // Filtering by search
      const searchQuery = search
        ? { name: { $regex: search, $options: "i" } }
        : {};

      // Filtering by brands (if brands are provided)
      const brandQuery = brands ? { brand: { $in: brands.split(",") } } : {};

      const categoryQuery = categories
        ? { category: { $in: categories.split(",") } }
        : {};
      const priceQuery = { price: { $gte: minPrice, $lte: maxPrice } };

      // Combine all queries
      const query = {
        ...searchQuery,
        ...brandQuery,
        ...categoryQuery,
        ...priceQuery,
      };

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

    // get all brands
    app.get("/brands", async (req, res) => {
      // Fetch all documents from the collection
      const allMobiles = await mobileCollection.find({}).toArray();

      // Extract all brands
      const allBrands = allMobiles.map((mobile) => mobile.brand);
      const allCategories = allMobiles.map((mobile) => mobile.category);

      // Filter unique brands using a Set
      const uniqueBrands = [...new Set(allBrands)];
      const uniqueCategory = [...new Set(allCategories)];

      // Send the unique brands as a response
      res.send({ brands: uniqueBrands, category: uniqueCategory });
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
