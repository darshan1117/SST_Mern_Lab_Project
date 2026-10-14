const Customer = require("../models/customer.model");
const Product = require("../models/product.model");

/**
 * @desc    Add product to wishlist
 * @route   POST /wishlist/:productId
 * @access  Private
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await Customer.findById(req.user._id);

    // Check if product is already in wishlist
    const isWishlisted = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isWishlisted) {
      return res.status(409).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request or server error"
    });
  }
};

/**
 * @desc    Get current user's populated wishlist
 * @route   GET /wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate("wishlist");

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error fetching wishlist"
    });
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await Customer.findById(req.user._id);

    const isWishlisted = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!isWishlisted) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist"
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request or server error"
    });
  }
};

/**
 * @desc    Toggle product in wishlist (Bonus Challenge)
 * @route   PATCH /wishlist/:productId/toggle
 * @access  Private
 */
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await Customer.findById(req.user._id);
    const index = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    let saved = false;
    if (index > -1) {
      user.wishlist.splice(index, 1);
      saved = false;
    } else {
      user.wishlist.push(productId);
      saved = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      saved,
      message: saved ? "Product added to wishlist" : "Product removed from wishlist"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request or server error"
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  toggleWishlist
};
