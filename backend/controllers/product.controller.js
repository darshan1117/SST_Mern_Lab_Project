const Product = require("../models/product.model");

const initialProducts = [
  // ==================== AUDIO ====================
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
  {
    name: "Studio USB Condenser Mic",
    description: "Cardioid broadcast-grade USB microphone for streaming, podcasting, and vocal recordings.",
    price: 3499,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.9,
    reviewsCount: 104
  },
  {
    name: "Hi-Fi Desktop Soundbar",
    description: "Compact dual-driver PC soundbar with Bluetooth 5.3, AUX input, and dynamic RGB underglow.",
    price: 2799,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop",
    stock: 10,
    rating: 4.7,
    reviewsCount: 65
  },
  {
    name: "Vintage Wireless Audio Speaker",
    description: "Classic retro leather-bound speaker with brass analog knobs and rich room-filling acoustic sound.",
    price: 4299,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop",
    stock: 8,
    rating: 4.9,
    reviewsCount: 112
  },

  // ==================== KEYBOARDS ====================
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB tactile mechanical gaming keyboard with hot-swappable switches and detachable braided cable.",
    price: 2999,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
    stock: 14,
    rating: 4.9,
    reviewsCount: 210
  },
  {
    name: "Wireless Compact 60% Keyboard",
    description: "Ultra-portable 61-key wireless Bluetooth keyboard with low-profile quiet linear switches.",
    price: 1799,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.7,
    reviewsCount: 114
  },
  {
    name: "Retro Typewriter Keyboard",
    description: "Vintage round keycap mechanical keyboard with clicky blue switches and white LED backlight.",
    price: 3899,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop",
    stock: 9,
    rating: 4.8,
    reviewsCount: 78
  },
  {
    name: "Ergonomic Split Keyboard",
    description: "Cushioned palm rest split keyframe keyboard for strain-free natural typing comfort.",
    price: 4499,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop",
    stock: 11,
    rating: 4.8,
    reviewsCount: 96
  },
  {
    name: "Custom PBT Dye-Sub Keycaps",
    description: "Thick dye-sublimated Cherry profile keycaps set compatible with standard mechanical layouts.",
    price: 1299,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop",
    stock: 25,
    rating: 4.7,
    reviewsCount: 143
  },
  {
    name: "Slim Aluminum Mac Keyboard",
    description: "Rechargeable multi-device ultra-thin keyboard with scissor switches and integrated numeric pad.",
    price: 2499,
    category: "Keyboards",
    image: "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=500&auto=format&fit=crop",
    stock: 16,
    rating: 4.8,
    reviewsCount: 88
  },

  // ==================== MICE & ACCESSORIES ====================
  {
    name: "Wireless Precision Mouse",
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
  {
    name: "Ergonomic Vertical Mouse",
    description: "Natural 57-degree handshake posture mouse designed to reduce wrist pressure and carpal strain.",
    price: 2199,
    category: "Mice",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.9,
    reviewsCount: 134
  },
  {
    name: "Extended Felt Desk Mat",
    description: "900x400mm premium water-resistant felt desk blotter with anti-slip rubberized bottom base.",
    price: 799,
    category: "Mice",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop",
    stock: 35,
    rating: 4.7,
    reviewsCount: 218
  },
  {
    name: "Fast Qi Wireless Charging Pad",
    description: "15W fast wireless charging pad with temperature control and non-slip silicone surface.",
    price: 1199,
    category: "Mice",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.6,
    reviewsCount: 77
  },

  // ==================== DISPLAYS ====================
  {
    name: "4K Gaming Monitor 144Hz",
    description: "27-inch 4K UHD 144Hz IPS display with 1ms response time, HDR400, and bezel-less design.",
    price: 14999,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
    stock: 8,
    rating: 4.9,
    reviewsCount: 118
  },
  {
    name: "Ultra-Wide Curved Monitor",
    description: "34-inch curved WQHD monitor with 21:9 aspect ratio and built-in USB hub for creators.",
    price: 24999,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=500&auto=format&fit=crop",
    stock: 7,
    rating: 4.8,
    reviewsCount: 76
  },
  {
    name: "Portable 15.6-inch Display",
    description: "Ultra-slim 1080p IPS portable secondary screen with Type-C and mini-HDMI connectivity.",
    price: 7999,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop",
    stock: 12,
    rating: 4.7,
    reviewsCount: 68
  },
  {
    name: "Dual Gas Spring Monitor Arm",
    description: "Heavy-duty full motion dual monitor desk mount supporting screens from 17 to 32 inches.",
    price: 3199,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop",
    stock: 14,
    rating: 4.8,
    reviewsCount: 89
  },
  {
    name: "Screenbar LED Monitor Light",
    description: "Eye-care asymmetric optical monitor light bar with auto-dimming touch sensor controls.",
    price: 2499,
    category: "Displays",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.9,
    reviewsCount: 154
  },

  // ==================== WEARABLES ====================
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
  {
    name: "Health & Sleep Tracker Band",
    description: "Lightweight continuous fitness bracelet with sleep stage analysis and 14-day battery reserve.",
    price: 1999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop",
    stock: 22,
    rating: 4.6,
    reviewsCount: 110
  },
  {
    name: "Rugged Outdoor GPS Watch",
    description: "Military-standard shockproof tactical outdoor watch with compass, barometer, and solar charging.",
    price: 11999,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop",
    stock: 6,
    rating: 4.9,
    reviewsCount: 94
  },
  {
    name: "Smart Health Ring",
    description: "Ceramic titanium smart ring monitoring blood oxygen, body temperature, and recovery scores.",
    price: 6499,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop",
    stock: 12,
    rating: 4.8,
    reviewsCount: 82
  },

  // ==================== FASHION ====================
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
  {
    name: "Minimalist RFID Cardholder",
    description: "Aircraft-grade aluminum slim card case with RFID shielding and pop-up ejection switch.",
    price: 899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop",
    stock: 30,
    rating: 4.8,
    reviewsCount: 180
  },
  {
    name: "Canvas Messenger Travel Bag",
    description: "Durable vintage waxed canvas shoulder bag with padded sleeve for tablet and accessories.",
    price: 2499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop",
    stock: 14,
    rating: 4.7,
    reviewsCount: 105
  },
  {
    name: "Classic Chronograph Wristwatch",
    description: "Minimalist stainless steel quartz wristwatch with genuine Italian brown leather strap.",
    price: 3199,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&auto=format&fit=crop",
    stock: 10,
    rating: 4.9,
    reviewsCount: 124
  },

  // ==================== HOME & DESK ====================
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
  },
  {
    name: "Aromatherapy Mist Diffuser",
    description: "Whisper-quiet ultrasonic essential oil diffuser with ambient warm glowing night light.",
    price: 1499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.6,
    reviewsCount: 75
  },
  {
    name: "Memory Foam Lumbar Support",
    description: "Ergonomic orthopedic back cushion contoured to relieve lower back pressure during long sitting.",
    price: 1299,
    category: "Home",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.8,
    reviewsCount: 95
  },
  {
    name: "Magnetic Cable Management Hub",
    description: "Weighted silicone desk organizer with magnetic collars for USB, HDMI, and charging wires.",
    price: 699,
    category: "Home",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop",
    stock: 28,
    rating: 4.7,
    reviewsCount: 110
  }
];

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Auto seed or update to full ShopKart catalogue if fewer products exist
    if (products.length < initialProducts.length || !products.some(p => p.category === "Keyboards")) {
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
  getProductById,
  initialProducts
};
