const Product = require("../models/product.model");

const initialProducts = [
  // Audio
  {
    name: "Noise Cancelling Headphones",
    description: "High-fidelity wireless headphones with active noise cancellation and 30-hour battery life.",
    price: 4999,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
    stock: 12,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    name: "Wireless Earbuds Pro",
    description: "Compact wireless earbuds with spatial audio, sweat resistance, and fast charging.",
    price: 2499,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.7,
    reviewsCount: 195
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof compact outdoor speaker with punchy bass and 12-hour continuous playtime.",
    price: 1999,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.6,
    reviewsCount: 88
  },

  // Keyboards
  {
    name: "Mechanical Keyboard",
    description: "RGB tactile mechanical gaming keyboard with hot-swappable switches and detachable cable.",
    price: 2999,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
    stock: 10,
    rating: 4.9,
    reviewsCount: 210
  },
  {
    name: "Wireless Compact Keyboard",
    description: "Slim wireless Bluetooth keyboard with low-profile quiet keys and multi-device pairing.",
    price: 1799,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.7,
    reviewsCount: 114
  },

  // Mice & Accessories
  {
    name: "Wireless Mouse",
    description: "Precision optical wireless ergonomic mouse designed for comfort during long working hours.",
    price: 1499,
    category: "Mice",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop",
    stock: 25,
    rating: 4.8,
    reviewsCount: 320
  },
  {
    name: "RGB Gaming Mouse",
    description: "Ultra-lightweight gaming mouse with 16000 DPI optical sensor and programmable buttons.",
    price: 1999,
    category: "Mice",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop",
    stock: 16,
    rating: 4.8,
    reviewsCount: 145
  },
  {
    name: "Multi-Port USB-C Hub",
    description: "8-in-1 aluminum adapter with dual 4K HDMI, 100W Power Delivery, and SD card readers.",
    price: 2299,
    category: "Mice",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop",
    stock: 22,
    rating: 4.6,
    reviewsCount: 92
  },

  // Displays
  {
    name: "4K Gaming Monitor",
    description: "27-inch 4K UHD 144Hz IPS display with 1ms response time, HDR400, and bezel-less design.",
    price: 14999,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
    stock: 5,
    rating: 4.9,
    reviewsCount: 118
  },
  {
    name: "Ultra-Wide Productivity Monitor",
    description: "34-inch curved WQHD monitor with 21:9 aspect ratio and built-in USB hub for creators.",
    price: 24999,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=500&auto=format&fit=crop",
    stock: 7,
    rating: 4.8,
    reviewsCount: 76
  },

  // Wearables
  {
    name: "Smart Fitness Watch",
    description: "Always-on AMOLED display with heart rate monitoring, SpO2 sensor, and 7-day battery life.",
    price: 3499,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
    stock: 14,
    rating: 4.7,
    reviewsCount: 160
  },
  {
    name: "Pro Titanium Smartwatch",
    description: "Durable sapphire crystal glass with dual-frequency GPS, titanium bezel, and water resistance.",
    price: 8999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop",
    stock: 9,
    rating: 4.9,
    reviewsCount: 130
  },

  // Fashion & Accessories
  {
    name: "Premium Leather Backpack",
    description: "Water-resistant genuine leather laptop backpack with dedicated 15.6-inch compartment.",
    price: 3999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.8,
    reviewsCount: 140
  },
  {
    name: "Classic Aviator Sunglasses",
    description: "Polarized UV400 protective metal sunglasses with scratch-resistant gradient lenses.",
    price: 1299,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.7,
    reviewsCount: 98
  },

  // Home & Desk
  {
    name: "Stainless Steel Water Bottle",
    description: "Vacuum insulated double-wall thermos bottle keeping drinks cold for 24 hours.",
    price: 899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop",
    stock: 30,
    rating: 4.8,
    reviewsCount: 220
  },
  {
    name: "Ergonomic Desk LED Lamp",
    description: "Eye-caring architectural LED desk lamp with dimmable color temperatures and USB charging port.",
    price: 1899,
    category: "Home",
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=500&auto=format&fit=crop",
    stock: 12,
    rating: 4.7,
    reviewsCount: 84
  }
];

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Auto seed or update to ShopKart catalogue if not populated with ShopKart products
    if (products.length === 0 || !products.some(p => p.category === "Keyboards")) {
      await Product.deleteMany({});
      products = await Product.insertMany(initialProducts);
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error fetching products"
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }
};

module.exports = {
  getAllProducts,
  getProductById
};
