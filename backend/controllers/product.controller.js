const Product = require("../models/product.model");

const initialProducts = [
  // Salad
  {
    name: "Greek Salad",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 180,
    category: "Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop",
    stock: 25,
    rating: 4.8,
    reviewsCount: 142
  },
  {
    name: "Veg Salad",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 140,
    category: "Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.6,
    reviewsCount: 98
  },
  {
    name: "Clover Salad",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 220,
    category: "Salad",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.9,
    reviewsCount: 215
  },
  {
    name: "Chicken Salad",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 280,
    category: "Salad",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.7,
    reviewsCount: 180
  },

  // Rolls
  {
    name: "Lasagna Rolls",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 240,
    category: "Rolls",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.8,
    reviewsCount: 165
  },
  {
    name: "Peri Peri Rolls",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 190,
    category: "Rolls",
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop",
    stock: 22,
    rating: 4.9,
    reviewsCount: 230
  },
  {
    name: "Chicken Rolls",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 260,
    category: "Rolls",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop",
    stock: 16,
    rating: 4.7,
    reviewsCount: 190
  },
  {
    name: "Veg Spring Rolls",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 160,
    category: "Rolls",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop",
    stock: 25,
    rating: 4.5,
    reviewsCount: 120
  },

  // Deserts
  {
    name: "Ripple Ice Cream",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 150,
    category: "Deserts",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop",
    stock: 30,
    rating: 4.9,
    reviewsCount: 310
  },
  {
    name: "Fruit Sorbet Delight",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 170,
    category: "Deserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.8,
    reviewsCount: 145
  },
  {
    name: "Jar Chocolate Cake",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 210,
    category: "Deserts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.9,
    reviewsCount: 280
  },
  {
    name: "Vanilla Swirl Cone",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 120,
    category: "Deserts",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop",
    stock: 28,
    rating: 4.6,
    reviewsCount: 95
  },

  // Sandwich
  {
    name: "Chicken Club Sandwich",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 230,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.8,
    reviewsCount: 178
  },
  {
    name: "Grilled Cheese Toast",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 180,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop",
    stock: 25,
    rating: 4.7,
    reviewsCount: 134
  },
  {
    name: "Vegan Avocado Sandwich",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 250,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop",
    stock: 14,
    rating: 4.9,
    reviewsCount: 210
  },
  {
    name: "Paneer Tikka Sandwich",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 210,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=500&auto=format&fit=crop",
    stock: 22,
    rating: 4.8,
    reviewsCount: 160
  },

  // Cake
  {
    name: "Cup Cake Trio",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 160,
    category: "Cake",
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&auto=format&fit=crop",
    stock: 25,
    rating: 4.8,
    reviewsCount: 195
  },
  {
    name: "Vegan Berry Cake",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 320,
    category: "Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop",
    stock: 10,
    rating: 4.9,
    reviewsCount: 260
  },
  {
    name: "Butterscotch Cake",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 290,
    category: "Cake",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=500&auto=format&fit=crop",
    stock: 12,
    rating: 4.7,
    reviewsCount: 170
  },
  {
    name: "Sliced Cheesecake",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 240,
    category: "Cake",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.9,
    reviewsCount: 220
  },

  // Pure Veg
  {
    name: "Garlic Butter Mushroom",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 220,
    category: "Pure Veg",
    image: "https://images.unsplash.com/photo-1546069901-d8a4f90bf43b?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.7,
    reviewsCount: 110
  },
  {
    name: "Garden Fresh Pulao",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 200,
    category: "Pure Veg",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop",
    stock: 20,
    rating: 4.8,
    reviewsCount: 140
  },

  // Pasta
  {
    name: "Tomato Basil Pasta",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 250,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop",
    stock: 18,
    rating: 4.9,
    reviewsCount: 240
  },
  {
    name: "Creamy Alfredo Pasta",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 280,
    category: "Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=500&auto=format&fit=crop",
    stock: 15,
    rating: 4.8,
    reviewsCount: 210
  },

  // Noodles
  {
    name: "Spicy Ramen Noodles",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 260,
    category: "Noodles",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop",
    stock: 22,
    rating: 4.9,
    reviewsCount: 310
  },
  {
    name: "Veg Hakka Noodles",
    description: "Food provides essential nutrients for overall health and well-being.",
    price: 190,
    category: "Noodles",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop",
    stock: 26,
    rating: 4.7,
    reviewsCount: 185
  }
];

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find({});
    
    // Auto seed or update to food menu if not populated with food menu
    if (products.length === 0 || !products.some(p => p.category === "Salad")) {
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
