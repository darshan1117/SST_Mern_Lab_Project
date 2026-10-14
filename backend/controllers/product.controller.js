const Product = require("../models/product.model");

const initialProducts = [
  // Electronics & Audio
  {
    name: "Sony WH-1000XM5 Noise Cancelling Headphones",
    description: "Industry-leading active noise canceling with 8 microphones, Auto NC Optimizer, and 30-hour battery life.",
    price: 24990,
    originalPrice: 29990,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    stock: 15,
    rating: 4.9,
    reviewsCount: 342
  },
  {
    name: "AirPods Pro (2nd Generation)",
    description: "Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, and USB-C MagSafe Charging Case.",
    price: 21900,
    originalPrice: 24900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop",
    stock: 20,
    rating: 4.8,
    reviewsCount: 512
  },
  {
    name: "JBL Flip 6 Waterproof Bluetooth Speaker",
    description: "Bold sound with 2-way speaker system, IP67 waterproof and dustproof, 12 hours of playtime.",
    price: 8999,
    originalPrice: 11999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop",
    stock: 25,
    rating: 4.7,
    reviewsCount: 189
  },
  {
    name: "Bose SoundLink Revolve+ II Bluetooth Speaker",
    description: "360-degree deep, jaw-dropping sound with seamless aluminum body and durable water-resistant design.",
    price: 22500,
    originalPrice: 26900,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop",
    stock: 8,
    rating: 4.8,
    reviewsCount: 95
  },

  // Computing & Gaming
  {
    name: "Keychron K2 V2 Wireless Mechanical Keyboard",
    description: "Compact 75% layout Bluetooth mechanical keyboard with RGB backlighting and Gateron G Pro switches.",
    price: 7499,
    originalPrice: 8999,
    category: "Computing",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
    stock: 12,
    rating: 4.9,
    reviewsCount: 210
  },
  {
    name: "Logitech MX Master 3S Wireless Ergonomic Mouse",
    description: "Quiet 8K DPI tracking sensor, electromagnetic MagSpeed scrolling, and ergonomic thumb rest.",
    price: 9495,
    originalPrice: 10995,
    category: "Computing",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop",
    stock: 18,
    rating: 4.9,
    reviewsCount: 428
  },
  {
    name: "Dell UltraSharp 27 4K USB-C Hub Monitor (U2723QE)",
    description: "27-inch 4K UHD IPS Black display with 2000:1 contrast ratio, 100% sRGB, and 90W Power Delivery.",
    price: 49999,
    originalPrice: 58999,
    category: "Computing",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
    stock: 6,
    rating: 4.8,
    reviewsCount: 115
  },
  {
    name: "Anker 10-in-1 USB-C Hub & Docking Station",
    description: "Dual 4K HDMI ports, 100W Power Delivery, SD/TF card readers, 1Gbps Ethernet, and 3 USB 3.0 ports.",
    price: 4499,
    originalPrice: 5999,
    category: "Computing",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop",
    stock: 30,
    rating: 4.6,
    reviewsCount: 167
  },
  {
    name: "SteelSeries Arctis Nova Pro Gaming Headset",
    description: "Active Noise Cancellation, Dual Wireless 2.4GHz + Bluetooth, and Multi-System Infinity Power System.",
    price: 28999,
    originalPrice: 32999,
    category: "Computing",
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&auto=format&fit=crop",
    stock: 10,
    rating: 4.7,
    reviewsCount: 84
  },

  // Wearables & Smart Tech
  {
    name: "Apple Watch Ultra 2 (GPS + Cellular)",
    description: "Rugged 49mm titanium case, brightest Apple display ever, dual-frequency GPS, and up to 36-hour battery.",
    price: 89900,
    originalPrice: 94900,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop",
    stock: 9,
    rating: 4.9,
    reviewsCount: 156
  },
  {
    name: "Samsung Galaxy Watch6 Classic (47mm LTE)",
    description: "Rotating bezel, Sapphire Crystal glass, Body Composition Analysis, and advanced sleep coaching.",
    price: 34999,
    originalPrice: 42999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
    stock: 14,
    rating: 4.7,
    reviewsCount: 204
  },

  // Fashion & Accessories
  {
    name: "Bellroy Transit Backpack 28L (Water Resistant)",
    description: "Quick-access 16-inch laptop compartment, hidden external pockets, and contoured padded shoulder straps.",
    price: 18999,
    originalPrice: 21999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
    stock: 16,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    name: "Ray-Ban Aviator Classic Polarized Sunglasses",
    description: "Iconic teardrop shape with G-15 green polarized lenses and gold metal frame.",
    price: 10490,
    originalPrice: 12490,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop",
    stock: 22,
    rating: 4.9,
    reviewsCount: 310
  },
  {
    name: "Fossil Townsman Automatic Leather Watch",
    description: "Exhibition dial showcasing internal mechanical movement with amber crystal glass and brown leather strap.",
    price: 16995,
    originalPrice: 19995,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop",
    stock: 11,
    rating: 4.7,
    reviewsCount: 88
  },
  {
    name: "Secrid Slimwallet Matte Leather Card Protector",
    description: "Patented aluminum cardprotector mechanism shielding cards against RFID/NFC scanning.",
    price: 5490,
    originalPrice: 6490,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop",
    stock: 28,
    rating: 4.8,
    reviewsCount: 175
  },

  // Home & Lifestyle
  {
    name: "Hydro Flask 32 oz Wide Mouth Insulated Water Bottle",
    description: "TempShield double-wall vacuum insulation keeps beverages cold for 24 hours or hot for 12 hours.",
    price: 3499,
    originalPrice: 4299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop",
    stock: 35,
    rating: 4.9,
    reviewsCount: 490
  },
  {
    name: "BenQ WiT e-Reading LED Desk Lamp",
    description: "Wide 90cm illumination range with auto-dimming sensor and ambient light detection for eye care.",
    price: 15999,
    originalPrice: 18999,
    category: "Home",
    image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop",
    stock: 10,
    rating: 4.8,
    reviewsCount: 76
  },
  {
    name: "Herman Miller Sayl Ergonomic Office Chair",
    description: "3D Intelligent suspension back support with adjustable lumbar and fully adjustable armrests.",
    price: 64900,
    originalPrice: 74900,
    category: "Home",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=600&auto=format&fit=crop",
    stock: 5,
    rating: 4.9,
    reviewsCount: 62
  },
  {
    name: "Fellow Ode Brew Gen 2 Coffee Grinder",
    description: "Precision 64mm stainless steel flat burrs with 31 grind settings for pour-over and drip coffee.",
    price: 29900,
    originalPrice: 34900,
    category: "Home",
    image: "https://images.unsplash.com/photo-1517668808822-9e428824603b?w=600&auto=format&fit=crop",
    stock: 7,
    rating: 4.8,
    reviewsCount: 54
  }
];

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Always sync database with rich catalogue if catalogue count < 10
    if (products.length < 10) {
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
