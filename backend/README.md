# 🛒 ShopKart — Full-Stack E-Commerce & Customer Authentication Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Mongoose%20v8-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20HttpOnly%20Cookies-black?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20Test%20Mode-0C2340?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing-brightgreen?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/api/test.html)

**ShopKart** is a production-grade, full-stack e-commerce web application engineered with the **MERN** stack (Node.js, Express.js, MongoDB/Mongoose, and React). The project demonstrates strict MVC backend architecture, end-to-end security practices, state synchronization, server-side business validation, and payment gateway integration.

---

## 📑 Table of Contents

- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Module Breakdown](#-module-breakdown)
- [Project Directory Structure](#-project-directory-structure)
- [Database Models & Schemas](#-database-models--schemas)
- [API Reference](#-api-reference)
- [Security & Engineering Highlights](#-security--engineering-highlights)
- [Getting Started & Installation](#-getting-started--installation)
- [Automated Test Suite](#-automated-test-suite)
- [Technical Viva Q&A Guide](#-technical-viva-qa-guide)
- [License](#-license)

---

## 🏛️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client Layer (React SPA)"]
        UI["Product Catalog / Quick View"]
        W["Wishlist Toggle (❤️)"]
        C["Cart Controls ([+] / [-] / Remove)"]
        CO["Checkout Form (6-digit Pin, 10-digit Phone)"]
        RZP_UI["Razorpay Checkout Modal"]
    end

    subgraph Security ["Security & Middleware"]
        AUTH_MW["auth.middleware.js (JWT in HttpOnly Cookie)"]
        HMAC_VERIFY["crypto HMAC SHA-256 Signature Verification"]
    end

    subgraph Server ["Backend Controllers (Express MVC)"]
        CUST_CTRL["customer.controller.js"]
        PROD_CTRL["product.controller.js"]
        WISH_CTRL["wishlist.controller.js"]
        CART_CTRL["cart.controller.js"]
        ORDER_CTRL["order.controller.js"]
    end

    subgraph Database ["Persistence Layer (MongoDB Atlas)"]
        DB_CUST[("Customers Collection")]
        DB_PROD[("Products Collection")]
        DB_ORD[("Orders Collection (Snapshots)")]
    end

    UI -->|Browse & Filter| PROD_CTRL
    W -->|POST / DELETE / PATCH toggle| AUTH_MW --> WISH_CTRL --> DB_CUST
    C -->|Update Qty / Stock check| AUTH_MW --> CART_CTRL --> DB_CUST
    CO -->|Submit Address| AUTH_MW --> ORDER_CTRL
    ORDER_CTRL -->|Verify Live Stock & Recalculate Total| DB_PROD
    ORDER_CTRL -->|Snapshot & Create Order| DB_ORD
    ORDER_CTRL -->|Create Order in Paise| RZP_API[("Razorpay Orders API")]
    RZP_API --> RZP_UI
    RZP_UI -->|payment_id + signature| HMAC_VERIFY
    HMAC_VERIFY -->|Valid Signature| ORDER_CTRL
    ORDER_CTRL -->|Mark PAID + Deduct Stock| DB_PROD
    ORDER_CTRL -->|Clear User Cart| DB_CUST
```

---

## 📦 Module Breakdown

### 1. Customer Authentication (Labs 01 & 02)
- **Registration**: Validates input completeness, email format, minimum 6-character password, and phone uniqueness. Stores passwords as one-way **bcrypt hashes** (cost factor 10).
- **Login**: Compares passwords using `bcrypt.compare`. On success, issues a signed JSON Web Token (JWT) serialized into an **HttpOnly, SameSite cookie**.
- **Edge-Case Validation**: Explicitly differentiates between unregistered emails (`404 Not Found` with a prompt to register) and invalid passwords (`401 Unauthorized` with inline field highlight).
- **Session Management**: Route protection middleware decodes the token from cookies, validates expiration, and attaches the customer instance to `req.user`.

### 2. Wishlist System (Lab 04)
- **Normalized Reference Architecture**: Persists only `ObjectId` references linked via Mongoose `ref: "Product"` rather than duplicated product documents.
- **Duplicate Prevention**: Rejects duplicate additions with `409 Conflict`.
- **Toggle Action**: Supports atomic `PATCH /wishlist/:productId/toggle` for single-click save/remove actions.
- **Query Hydration**: Utilizes `.populate("wishlist")` to pull live product details without data drift.

### 3. Shopping Cart Management (Lab 05)
- **Nested Array Schema**: Stores `{ product: ObjectId, quantity: Number }` directly on the Customer document.
- **Live Stock Enforcement**: Verifies catalog inventory on each addition and update. Rejects requests exceeding inventory with `400 Bad Request`.
- **Quantity Adjustments**: Incremental `+1` / `-1` operations with strict bounds (`quantity >= 1`).
- **Derived State**: Subtotals, tax, and item counts are calculated dynamically on the server and frontend state without storing redundant cached amounts in MongoDB.

### 4. Checkout, Razorpay & Order Processing (Lab 06)
- **Zero Frontend Trust**: Frontend totals are ignored. The server re-fetches product documents, recalculates sums, and verifies stock before order generation.
- **Historical Purchase Snapshots**: Copies purchase-time product name, price, thumbnail, and quantity into the `Order` model, ensuring subsequent catalog price modifications do not alter past invoices.
- **Razorpay Integration (Test Mode)**: 
  - Converts amounts to smallest currency denomination (INR to Paise: `total * 100`).
  - Creates server-side Razorpay order.
  - Verifies payment authenticity via Node's native `crypto` module (`HMAC-SHA256`).
- **Transactional State Transition**: The user's cart is cleared **only** after successful payment signature verification.

---

## 📂 Project Directory Structure

```text
LAB_PROJECT/
├── backend/
│   ├── config/
│   │   └── razorpay.js              # Razorpay SDK configuration
│   ├── controllers/
│   │   ├── cart.controller.js       # Cart addition, quantity, and removal logic
│   │   ├── customer.controller.js   # Registration, login, profile & password change
│   │   ├── order.controller.js      # Order snapshotting, Razorpay order & signature check
│   │   ├── product.controller.js    # Product catalog retrieval & database seeding
│   │   └── wishlist.controller.js   # Wishlist toggle and reference management
│   ├── middlewares/
│   │   └── auth.middleware.js       # JWT cookie verification middleware
│   ├── models/
│   │   ├── customer.model.js        # Customer schema (bcrypt hook, wishlist, cart)
│   │   ├── order.model.js           # Order schema (item snapshots, shipping, payment status)
│   │   └── product.model.js         # Product schema (price, stock, category, rating)
│   ├── public/
│   │   └── index.html               # Single Page Application (React 18 + Tailwind CSS)
│   ├── routes/
│   │   ├── cart.routes.js           # /cart endpoints
│   │   ├── customer.routes.js       # /customers & /users endpoints
│   │   ├── order.routes.js          # /orders endpoints
│   │   ├── product.routes.js        # /products endpoints
│   │   └── wishlist.routes.js       # /wishlist endpoints
│   ├── utils/
│   │   └── generateToken.js         # JWT generation & HttpOnly cookie configuration
│   ├── .env                         # Environment variables (MongoDB URI, JWT secret, Razorpay keys)
│   ├── index.js                     # Express application entrypoint & static server
│   ├── package.json                 # Backend dependencies & test scripts
│   └── test.js                      # Automated test suite (node:test + supertest)
├── frontend/
│   └── src/
│       └── context/
│           ├── AuthContext.jsx          # React Authentication context provider
│           └── CartWishlistContext.jsx  # Cart & Wishlist state management provider
├── package.json                     # Root orchestrator package.json
└── README.md                        # Project documentation
```

---

## 🗄️ Database Models & Schemas

### Customer Schema (`customer.model.js`)
```javascript
{
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone:    { type: String, required: true, trim: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cart: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1, min: 1 }
    }
  ]
}
```

### Order Schema (`order.model.js`)
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name:     { type: String, required: true },
      price:    { type: Number, required: true },
      quantity: { type: Number, required: true },
      image:    { type: String }
    }
  ],
  shippingAddress: {
    fullName:     { type: String, required: true },
    phone:        { type: String, required: true },
    addressLine1: { type: String, required: true },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    pincode:      { type: String, required: true }
  },
  totalAmount:       { type: Number, required: true },
  paymentStatus:     { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
  status:            { type: String, enum: ["PENDING_PAYMENT", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"], default: "PENDING_PAYMENT" },
  razorpayOrderId:   String,
  razorpayPaymentId: String
}
```

---

## 🔌 API Reference

### 🔐 Authentication (`/customers`)
| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/customers/register` | Public | Register customer; returns sanitized customer record |
| `POST` | `/customers/login` | Public | Authenticates credentials; sets JWT HttpOnly cookie |
| `GET` | `/customers/me` | Protected | Returns current authenticated customer profile |
| `POST` | `/customers/logout` | Protected | Clears authentication cookie |
| `PATCH` | `/customers/change-password` | Protected | Validates old password and hashes new password |

### 🛍️ Products (`/products`)
| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/products` | Public | Fetch catalog with category counts and stock |
| `GET` | `/products/:id` | Public | Fetch product details by ID |

### ❤️ Wishlist (`/wishlist`)
| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/wishlist` | Protected | Get customer's populated wishlist |
| `POST` | `/wishlist/:productId` | Protected | Add product to wishlist (prevents duplicates) |
| `DELETE` | `/wishlist/:productId` | Protected | Remove product from wishlist |
| `PATCH` | `/wishlist/:productId/toggle`| Protected | Toggle product in/out of wishlist |

### 🛒 Shopping Cart (`/cart`)
| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `GET` | `/cart` | Protected | Fetch current user's populated cart |
| `POST` | `/cart/:productId` | Protected | Add item or increment quantity if existing |
| `PATCH` | `/cart/:productId` | Protected | Set explicit item quantity (enforces stock limits) |
| `DELETE` | `/cart/:productId` | Protected | Remove item from cart |

### 💳 Orders & Payments (`/orders`)
| Method | Endpoint | Access | Description |
|:-------|:---------|:-------|:------------|
| `POST` | `/orders/create-payment-order` | Protected | Validates stock, calculates server total, creates order & Razorpay order |
| `POST` | `/orders/verify-payment` | Protected | Validates HMAC SHA-256 signature, marks order `PAID`, deducts stock, clears cart |
| `GET` | `/orders` | Protected | Returns customer's historical orders (newest first) |
| `GET` | `/orders/:id` | Protected | Fetches specific order (strictly validates ownership) |
| `PATCH` | `/orders/:id/status` | Protected | Updates order progress (`PLACED` → `CONFIRMED` → `SHIPPED` → `DELIVERED`) |

---

## 🔒 Security & Engineering Highlights

1. **HttpOnly Cookie Architecture**:
   - Authentication tokens are transmitted in `Set-Cookie` with `httpOnly: true` and `sameSite: "lax"`.
   - Prevents unauthorized client-side JavaScript access, mitigating **Cross-Site Scripting (XSS)** token exfiltration.
2. **Cryptographic Payment Verification**:
   - Implements HMAC-SHA256 signature calculation using Node.js `crypto`:
     ```javascript
     const body = order.razorpayOrderId + "|" + razorpay_payment_id;
     const expectedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
       .update(body)
       .digest("hex");
     ```
   - Guards against client-side transaction spoofing.
3. **Database Fallback Resilience**:
   - `index.js` connects to **MongoDB Atlas**. If network interruptions or DNS restrictions arise, the server activates an in-memory **MongoMemoryServer** instance, maintaining 100% API availability.
4. **Ownership Verification**:
   - Direct Object Reference access is prevented on `/orders/:id`:
     ```javascript
     if (order.user.toString() !== req.user._id.toString()) {
       return res.status(403).json({ success: false, message: "Access denied" });
     }
     ```

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- Active Internet connection (for MongoDB Atlas connection)

### 1. Clone & Install Dependencies
```bash
# Navigate to the project backend
cd backend

# Install production and development dependencies
npm install
```

### 2. Configure Environment Variables
Verify or edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://darshanfleix_db_user:CnM3wL5LGxwMJr17@ac-arqsmdw-shard-00-00.xieu5j8.mongodb.net:27017,ac-arqsmdw-shard-00-01.xieu5j8.mongodb.net:27017,ac-arqsmdw-shard-00-02.xieu5j8.mongodb.net:27017/shopkart?ssl=true&replicaSet=atlas-t7c8mm-shard-0&authSource=admin&appName=Cluster0
JWT_SECRET=shopkart_jwt_secret_key_2026_super_secure_lab01
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_shopkart123
RAZORPAY_KEY_SECRET=secret_shopkart123
```

### 3. Launch the Server
```bash
npm start
```
The server will start at:
```text
http://localhost:5000
```
Open this URL in any web browser to use the full shopping interface.

---

## 🧪 Automated Test Suite

The test suite is written using the native **Node.js test runner** (`node:test`, `node:assert`) and **Supertest** against an isolated in-memory MongoDB environment.

To run the full test suite:
```bash
npm test
```

### Test Coverage Summary:
```text
▶ ShopKart Comprehensive Full-Stack API Suite (Labs 01 - 06)
  ▶ Authentication APIs
    ✔ should register customer & hash password in DB
    ✔ should reject login with wrong password
  ✔ Authentication APIs (274ms)
  ▶ Wishlist APIs (Lab 04)
    ✔ should add product to wishlist and populate references
    ✔ should prevent duplicate wishlist entries (409 Conflict)
    ✔ should remove product from wishlist
  ✔ Wishlist APIs (Lab 04) (469ms)
  ▶ Shopping Cart APIs (Lab 05)
    ✔ should add product to cart and increment quantity on duplicate add
    ✔ should update quantity and validate stock limit
    ✔ should remove product from cart
  ✔ Shopping Cart APIs (Lab 05) (457ms)
  ▶ Checkout & Order APIs (Lab 06)
    ✔ should create payment order with server-calculated total and snapshot items
    ✔ should reject invalid payment signature and keep cart intact
    ✔ should verify valid payment signature, mark order PAID/PLACED, and clear cart
    ✔ should prevent non-owner from viewing order (403 Forbidden)
  ✔ Checkout & Order APIs (Lab 06) (2190ms)

ℹ tests 12 | suites 5 | pass 12 | fail 0
```

---

## 🎓 Technical Viva Q&A Guide

#### 1. Why do we hash passwords with bcrypt instead of encrypting them?
> Encryption is two-way (reversible with a key). Hashing is one-way (irreversible). If a database is breached, encrypted passwords can be decrypted if the key is obtained, whereas bcrypt hashes cannot be decrypted. Bcrypt also includes a configurable work factor (salt rounds) that prevents rainbow table and brute-force attacks.

#### 2. Why is the `HttpOnly` flag essential on cookies storing JWTs?
> When a cookie has `httpOnly: true`, browser scripts cannot access it via `document.cookie`. This prevents Cross-Site Scripting (XSS) attacks from stealing the authentication token.

#### 3. Why snapshot product name and price into the Order schema rather than referencing Product?
> Product catalog data changes over time (prices rise, descriptions update, or products are discontinued). If an order only referenced the Product ID, a user's past invoice would display the *new* price rather than what they actually paid at the moment of checkout.

#### 4. Why must `totalAmount` be calculated strictly on the backend?
> The client cannot be trusted. If the frontend sends `{ totalAmount: 1 }`, a malicious actor could intercept and modify HTTP requests to purchase expensive inventory for pennies. The backend must query the database, look up current product prices, multiply by quantities, and establish the authoritative sum.

#### 5. Why is HMAC SHA-256 signature verification mandatory in Razorpay?
> When payment completes in the frontend modal, the browser receives payment identifiers. If the backend accepted `paymentSuccess: true` from the client, anyone could send a fake request to mark an order as paid. The HMAC SHA-256 signature proves that the response was signed using your secret key by Razorpay's servers.

#### 6. Why should the cart be cleared only after payment verification, not order creation?
> If the user opens the checkout modal but cancels or their payment fails, their cart should remain intact so they do not lose their selected items. Clearing the cart prematurely results in a poor user experience.

---

## 📄 License

This project was built for educational purposes as part of the **ShopKart Backend & Full-Stack Engineering Labs**.

Distributed under the **ISC License**. Feel free to fork, customize, and extend.
