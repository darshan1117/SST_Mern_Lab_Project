const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use("/customers", customerRoutes);
app.use("/users", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/customers") ||
    req.path.startsWith("/users") ||
    req.path.startsWith("/products") ||
    req.path.startsWith("/wishlist") ||
    req.path.startsWith("/cart") ||
    req.path.startsWith("/orders")
  ) {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
let MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://darshanfleix_db_user:CnM3wL5LGxwMJr17@ac-arqsmdw-shard-00-00.xieu5j8.mongodb.net:27017,ac-arqsmdw-shard-00-01.xieu5j8.mongodb.net:27017,ac-arqsmdw-shard-00-02.xieu5j8.mongodb.net:27017/shopkart?ssl=true&replicaSet=atlas-t7c8mm-shard-0&authSource=admin&appName=Cluster0";

let server;

const startServer = async () => {
  if (process.env.NODE_ENV !== "test") {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
      console.log("Connected to MongoDB Atlas cluster successfully");
    } catch (err) {
      console.log("Starting in-memory MongoDB fallback...");
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoMemoryServer = await MongoMemoryServer.create();
        MONGODB_URI = mongoMemoryServer.getUri();
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to in-memory MongoDB");
      } catch (memErr) {
        console.error("MongoDB start failed:", memErr.message);
      }
    }

    server = app.listen(PORT, () => {
      console.log(`ShopKart Server running on http://localhost:${PORT}`);
    });
  }
};

startServer();

module.exports = { app, mongoose };
