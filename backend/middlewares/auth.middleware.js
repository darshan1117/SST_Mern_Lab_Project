const jwt = require("jsonwebtoken");
const Customer = require("../models/customer.model");

/**
 * Authentication Middleware to protect routes using JWT stored in HttpOnly cookie.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Read token from cookies (primary) or Authorization header (fallback)
    if (req.cookies && (req.cookies.token || req.cookies.jwt)) {
      token = req.cookies.token || req.cookies.jwt;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided"
      });
    }

    const secret = process.env.JWT_SECRET || "shopkart_jwt_secret_key_2026_super_secure_lab01";
    const decoded = jwt.verify(token, secret);

    const customer = await Customer.findById(decoded.id).select("-password");
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Customer not found"
      });
    }

    req.user = customer;
    req.customer = customer;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token"
    });
  }
};

module.exports = protect;
module.exports.protect = protect;
