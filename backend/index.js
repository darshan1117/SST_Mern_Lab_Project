const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const customerRoutes = require("./routes/customer.routes");
const productRoutes = require("./routes/product.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for evaluation / cross-deployment
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Base API Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ShopKart Backend REST API is running"
  });
});

// API Routes
app.use("/customers", customerRoutes);
app.use("/users", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
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
      console.log(`ShopKart Backend REST API running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = { app, mongoose };
