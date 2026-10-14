const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a customer and sets it as an HttpOnly cookie.
 * @param {Object} res - Express response object
 * @param {string|Object} userId - Customer ID
 * @returns {string} - Generated JWT token
 */
const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || "shopkart_jwt_secret_key_2026_super_secure_lab01";
  
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: "7d"
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res.cookie("token", token, cookieOptions);

  return token;
};

module.exports = generateToken;
