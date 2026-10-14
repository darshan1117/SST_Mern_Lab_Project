import React from "react";
import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
  const { page, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-xl animate-toast ${
              toast.type === "error" ? "bg-rose-600" : "bg-[#2e7d32]"
            }`}
          >
            {toast.message}
          </div>
        )}

        <Navbar />

        <main>
          {page === "home" && <Home />}
          {page === "wishlist" && <Wishlist />}
          {page === "cart" && <Cart />}
          {page === "checkout" && <Checkout />}
          {page === "orders" && <Orders />}
          {page === "success" && <OrderSuccess />}
        </main>

        <AuthModal />
      </div>

      <Footer />
    </div>
  );
};

export default App;
