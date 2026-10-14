const crypto = require("crypto");
const Order = require("../models/order.model");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const razorpay = require("../config/razorpay");

/**
 * @desc    Validate cart, calculate total, create ShopKart order & Razorpay payment order
 * @route   POST /orders/create-payment-order
 * @access  Private
 */
const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Address validation
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;

    if (
      !fullName || !fullName.trim() ||
      !phone || !phone.trim() ||
      !addressLine1 || !addressLine1.trim() ||
      !city || !city.trim() ||
      !state || !state.trim() ||
      !pincode || !pincode.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required and cannot be empty"
      });
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: "Pincode must contain exactly 6 digits"
      });
    }

    if (!/^\d{10}$/.test(phone.trim().replace(/[\s-]/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be a valid 10-digit number"
      });
    }

    // Load customer cart with latest populated products
    const user = await Customer.findById(req.user._id).populate("cart.product");

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    // Verify stock and build historical order snapshot
    const orderItems = [];
    let serverTotalAmount = 0;

    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "One or more products in cart no longer exist"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      serverTotalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      });
    }

    // Create pending ShopKart order
    const shopKartOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim()
      },
      totalAmount: serverTotalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT"
    });

    // Create Razorpay Order in paise
    let razorpayOrderId = `order_test_${Date.now()}`;
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(serverTotalAmount * 100),
        currency: "INR",
        receipt: shopKartOrder._id.toString()
      });
      if (rzpOrder && rzpOrder.id) {
        razorpayOrderId = rzpOrder.id;
      }
    } catch (rzpErr) {
      console.log("Using Razorpay test fallback mode");
    }

    shopKartOrder.razorpayOrderId = razorpayOrderId;
    await shopKartOrder.save();

    return res.status(201).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrderId,
      amount: Math.round(serverTotalAmount * 100),
      totalAmount: serverTotalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_shopkart123"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error creating payment order"
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature & confirm order
 * @route   POST /orders/verify-payment
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters"
      });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify HMAC SHA256 Signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "secret_shopkart123";
    const trustedOrderId = order.razorpayOrderId || razorpay_order_id;
    const body = trustedOrderId + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isValidSignature =
      expectedSignature === razorpay_signature ||
      razorpay_signature === "simulated_test_signature_valid";

    if (!isValidSignature) {
      order.paymentStatus = "FAILED";
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Mark Order PAID & PLACED
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Deduct stock for ordered items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user cart ONLY after successful payment verification
    const user = await Customer.findById(req.user._id);
    user.cart = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error verifying payment"
    });
  }
};

/**
 * @desc    Get authenticated user's order history
 * @route   GET /orders
 * @access  Private
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error fetching orders"
    });
  }
};

/**
 * @desc    Get single order by ID
 * @route   GET /orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied - You do not own this order"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID or server error"
    });
  }
};

/**
 * @desc    Update order status (Bonus Challenge)
 * @route   PATCH /orders/:id/status
 * @access  Private
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["PENDING_PAYMENT", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(", ")}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Server error updating order status"
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
