const Customer = require("../models/customer.model");
const generateToken = require("../utils/generateToken");

const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: "Full Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must contain at least 6 characters" });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const existingCustomer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existingCustomer) {
      return res.status(409).json({ success: false, message: "Email already registered. Please log in instead!" });
    }

    const customer = await Customer.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim()
    });

    const token = generateToken(res, customer._id);

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      token,
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    return res.status(500).json({ success: false, message: error.message || "Registration error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Please enter your email address" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Please enter your password" });
    }

    const customer = await Customer.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // Edge Case 1: Account does not exist in DB
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Account not registered. Please register first!"
      });
    }

    // Edge Case 2: Account exists, but password is wrong
    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again!"
      });
    }

    const token = generateToken(res, customer._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Login error" });
  }
};

const getProfile = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Profile error" });
  }
};

const logoutCustomer = async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0), sameSite: "lax" });
    res.clearCookie("token");
    res.clearCookie("jwt");

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Logout error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide both old and new passwords" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must contain at least 6 characters" });
    }

    const customer = await Customer.findById(req.user._id).select("+password");
    if (!customer || !(await customer.matchPassword(oldPassword))) {
      return res.status(400).json({ success: false, message: "Invalid current password" });
    }

    customer.password = newPassword;
    await customer.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Password change error" });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getProfile,
  logoutCustomer,
  changePassword
};
