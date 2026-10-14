const Customer = require("../models/customer.model");
const Product = require("../models/product.model");


const addToCart = async (req, res) => {
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

    const existingCartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    let targetQuantity = 1;
    if (existingCartItem) {
      targetQuantity = existingCartItem.quantity + 1;
    }

    // Validate stock limit
    if (targetQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity exceeds available stock (${product.stock} left)`
      });
    }

    if (existingCartItem) {
      existingCartItem.quantity = targetQuantity;
    } else {
      user.cart.push({
        product: productId,
        quantity: 1
      });
    }

    await user.save();

    const updatedUser = await Customer.findById(req.user._id).populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedUser.cart
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request or server error"
    });
  }
};

/**
 * @desc    Get current user's populated cart
 * @route   GET /cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    const user = await Customer.findById(req.user._id).populate("cart.product");

    return res.status(200).json({
      success: true,
      cart: user.cart || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error fetching cart"
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PATCH /cart/:productId
 * @access  Private
 */
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const newQuantity = Number(quantity);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await Customer.findById(req.user._id);

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    // Validate stock limit
    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Quantity exceeds available stock (${product.stock} available)`
      });
    }

    cartItem.quantity = newQuantity;
    await user.save();

    const updatedUser = await Customer.findById(req.user._id).populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedUser.cart
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request or server error"
    });
  }
};

/**
 * @desc    Remove product from cart
 * @route   DELETE /cart/:productId
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await Customer.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await Customer.findById(req.user._id).populate("cart.product");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedUser.cart
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Invalid request or server error"
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};
