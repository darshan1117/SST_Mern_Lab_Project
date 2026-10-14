const { describe, it, before, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const crypto = require("crypto");

// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test_jwt_secret_key_shopkart_123";
process.env.RAZORPAY_KEY_SECRET = "test_rzp_secret_key_123";

const { app } = require("./index");
const Customer = require("./models/customer.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");

let mongoServer;
let testProduct1, testProduct2;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Seed test products
    testProduct1 = await Product.create({
      name: "Mechanical Keyboard",
      description: "RGB Mechanical Keyboard",
      price: 2999,
      category: "Electronics",
      image: "https://example.com/keyboard.jpg",
      stock: 10
    });

    testProduct2 = await Product.create({
      name: "Wireless Mouse",
      description: "Ergonomic Wireless Mouse",
      price: 1499,
      category: "Electronics",
      image: "https://example.com/mouse.jpg",
      stock: 5
    });
  }
});

describe("ShopKart Comprehensive Full-Stack API Suite (Labs 01 - 06)", () => {

  // Helper function to register & login a user
  const createAuthenticatedUser = async (email = "john@gmail.com") => {
    await request(app)
      .post("/customers/register")
      .send({
        fullName: "John Doe",
        email,
        password: "john123",
        phone: "9876543210"
      });

    const loginRes = await request(app)
      .post("/customers/login")
      .send({
        email,
        password: "john123"
      });

    return loginRes.headers["set-cookie"];
  };

  // ==========================================
  // LAB 01: Customer Authentication
  // ==========================================
  describe("Authentication APIs", () => {
    it("should register customer & hash password in DB", async () => {
      const res = await request(app)
        .post("/customers/register")
        .send({
          fullName: "Alice Smith",
          email: "alice@gmail.com",
          password: "alice123",
          phone: "9876543210"
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.customer.email, "alice@gmail.com");

      const dbUser = await Customer.findOne({ email: "alice@gmail.com" }).select("+password");
      assert.ok(dbUser.password.startsWith("$2a$") || dbUser.password.startsWith("$2b$"));
    });

    it("should reject login with wrong password", async () => {
      await request(app)
        .post("/customers/register")
        .send({
          fullName: "Alice Smith",
          email: "alice@gmail.com",
          password: "alice123",
          phone: "9876543210"
        });

      const res = await request(app)
        .post("/customers/login")
        .send({
          email: "alice@gmail.com",
          password: "wrongpassword"
        });

      assert.strictEqual(res.status, 401);
    });
  });

  // ==========================================
  // LAB 04: Wishlist System
  // ==========================================
  describe("Wishlist APIs (Lab 04)", () => {
    it("should add product to wishlist and populate references", async () => {
      const authCookie = await createAuthenticatedUser();

      // Add to wishlist
      const addRes = await request(app)
        .post(`/wishlist/${testProduct1._id}`)
        .set("Cookie", authCookie);

      assert.strictEqual(addRes.status, 200);
      assert.strictEqual(addRes.body.success, true);

      // Fetch wishlist
      const getRes = await request(app)
        .get("/wishlist")
        .set("Cookie", authCookie);

      assert.strictEqual(getRes.status, 200);
      assert.strictEqual(getRes.body.count, 1);
      assert.strictEqual(getRes.body.wishlist[0].name, "Mechanical Keyboard");
    });

    it("should prevent duplicate wishlist entries (409 Conflict)", async () => {
      const authCookie = await createAuthenticatedUser();

      await request(app).post(`/wishlist/${testProduct1._id}`).set("Cookie", authCookie);
      const dupRes = await request(app).post(`/wishlist/${testProduct1._id}`).set("Cookie", authCookie);

      assert.strictEqual(dupRes.status, 409);
      assert.strictEqual(dupRes.body.success, false);
    });

    it("should remove product from wishlist", async () => {
      const authCookie = await createAuthenticatedUser();

      await request(app).post(`/wishlist/${testProduct1._id}`).set("Cookie", authCookie);
      const delRes = await request(app).delete(`/wishlist/${testProduct1._id}`).set("Cookie", authCookie);

      assert.strictEqual(delRes.status, 200);

      const getRes = await request(app).get("/wishlist").set("Cookie", authCookie);
      assert.strictEqual(getRes.body.count, 0);
    });
  });

  // ==========================================
  // LAB 05: Shopping Cart System
  // ==========================================
  describe("Shopping Cart APIs (Lab 05)", () => {
    it("should add product to cart and increment quantity on duplicate add", async () => {
      const authCookie = await createAuthenticatedUser();

      // First add
      await request(app).post(`/cart/${testProduct1._id}`).set("Cookie", authCookie);
      // Second add
      const res = await request(app).post(`/cart/${testProduct1._id}`).set("Cookie", authCookie);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.cart.length, 1);
      assert.strictEqual(res.body.cart[0].quantity, 2);
    });

    it("should update quantity and validate stock limit", async () => {
      const authCookie = await createAuthenticatedUser();
      await request(app).post(`/cart/${testProduct1._id}`).set("Cookie", authCookie);

      // Valid update within stock (stock is 10)
      const validUpdate = await request(app)
        .patch(`/cart/${testProduct1._id}`)
        .set("Cookie", authCookie)
        .send({ quantity: 5 });

      assert.strictEqual(validUpdate.status, 200);
      assert.strictEqual(validUpdate.body.cart[0].quantity, 5);

      // Invalid update exceeding stock (quantity = 15 > stock 10)
      const exceedStock = await request(app)
        .patch(`/cart/${testProduct1._id}`)
        .set("Cookie", authCookie)
        .send({ quantity: 15 });

      assert.strictEqual(exceedStock.status, 400);
      assert.strictEqual(exceedStock.body.success, false);
    });

    it("should remove product from cart", async () => {
      const authCookie = await createAuthenticatedUser();
      await request(app).post(`/cart/${testProduct1._id}`).set("Cookie", authCookie);

      const removeRes = await request(app).delete(`/cart/${testProduct1._id}`).set("Cookie", authCookie);
      assert.strictEqual(removeRes.status, 200);
      assert.strictEqual(removeRes.body.cart.length, 0);
    });
  });

  // ==========================================
  // LAB 06: Checkout, Razorpay & Orders
  // ==========================================
  describe("Checkout & Order APIs (Lab 06)", () => {
    let authCookie;

    beforeEach(async () => {
      authCookie = await createAuthenticatedUser();
      // Add items to cart: Keyboard x 2 (2999 * 2 = 5998) + Mouse x 1 (1499 * 1 = 1499) = Total 7497
      await request(app).post(`/cart/${testProduct1._id}`).set("Cookie", authCookie);
      await request(app).post(`/cart/${testProduct1._id}`).set("Cookie", authCookie);
      await request(app).post(`/cart/${testProduct2._id}`).set("Cookie", authCookie);
    });

    it("should create payment order with server-calculated total and snapshot items", async () => {
      const res = await request(app)
        .post("/orders/create-payment-order")
        .set("Cookie", authCookie)
        .send({
          shippingAddress: {
            fullName: "Aarav Sharma",
            phone: "9876543210",
            addressLine1: "22 MG Road",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560001"
          }
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.totalAmount, 7497); // 2999*2 + 1499*1
      assert.strictEqual(res.body.amount, 749700); // 7497 * 100 paise
      assert.ok(res.body.shopKartOrderId);
      assert.ok(res.body.razorpayOrderId);
    });

    it("should reject invalid payment signature and keep cart intact", async () => {
      const createRes = await request(app)
        .post("/orders/create-payment-order")
        .set("Cookie", authCookie)
        .send({
          shippingAddress: {
            fullName: "Aarav Sharma",
            phone: "9876543210",
            addressLine1: "22 MG Road",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560001"
          }
        });

      const verifyRes = await request(app)
        .post("/orders/verify-payment")
        .set("Cookie", authCookie)
        .send({
          shopKartOrderId: createRes.body.shopKartOrderId,
          razorpay_order_id: createRes.body.razorpayOrderId,
          razorpay_payment_id: "pay_test_123",
          razorpay_signature: "invalid_fake_signature"
        });

      assert.strictEqual(verifyRes.status, 400);
      assert.strictEqual(verifyRes.body.success, false);

      // Verify cart was NOT cleared
      const cartRes = await request(app).get("/cart").set("Cookie", authCookie);
      assert.strictEqual(cartRes.body.cart.length, 2);
    });

    it("should verify valid payment signature, mark order PAID/PLACED, and clear cart", async () => {
      const createRes = await request(app)
        .post("/orders/create-payment-order")
        .set("Cookie", authCookie)
        .send({
          shippingAddress: {
            fullName: "Aarav Sharma",
            phone: "9876543210",
            addressLine1: "22 MG Road",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560001"
          }
        });

      const shopKartOrderId = createRes.body.shopKartOrderId;
      const razorpayOrderId = createRes.body.razorpayOrderId;
      const razorpayPaymentId = "pay_test_999";

      // Generate valid HMAC signature matching server calculation
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const validSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

      const verifyRes = await request(app)
        .post("/orders/verify-payment")
        .set("Cookie", authCookie)
        .send({
          shopKartOrderId,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: validSignature
        });

      assert.strictEqual(verifyRes.status, 200);
      assert.strictEqual(verifyRes.body.order.paymentStatus, "PAID");
      assert.strictEqual(verifyRes.body.order.status, "PLACED");

      // Verify cart was cleared after successful payment
      const cartRes = await request(app).get("/cart").set("Cookie", authCookie);
      assert.strictEqual(cartRes.body.cart.length, 0);

      // Verify order appears in user order history
      const ordersRes = await request(app).get("/orders").set("Cookie", authCookie);
      assert.strictEqual(ordersRes.status, 200);
      assert.strictEqual(ordersRes.body.orders.length, 1);
      assert.strictEqual(ordersRes.body.orders[0]._id.toString(), shopKartOrderId.toString());
    });

    it("should prevent non-owner from viewing order (403 Forbidden)", async () => {
      const createRes = await request(app)
        .post("/orders/create-payment-order")
        .set("Cookie", authCookie)
        .send({
          shippingAddress: {
            fullName: "Aarav Sharma",
            phone: "9876543210",
            addressLine1: "22 MG Road",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560001"
          }
        });

      const otherUserCookie = await createAuthenticatedUser("otheruser@gmail.com");

      const forbiddenRes = await request(app)
        .get(`/orders/${createRes.body.shopKartOrderId}`)
        .set("Cookie", otherUserCookie);

      assert.strictEqual(forbiddenRes.status, 403);
    });
  });
});
