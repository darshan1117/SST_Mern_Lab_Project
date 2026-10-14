import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, setAuthToken } from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("home"); // home, cart, checkout, orders, wishlist, success
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUser = async () => {
    try {
      const res = await apiFetch("/customers/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await apiFetch("/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const fetchCart = async () => {
    if (!user) return setCart([]);
    try {
      const res = await apiFetch("/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || []);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return setWishlist([]);
    try {
      const res = await apiFetch("/wishlist");
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  };

  const fetchOrders = async () => {
    if (!user) return setOrders([]);
    try {
      const res = await apiFetch("/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/customers/logout", { method: "POST" });
    } catch (err) {}
    setAuthToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    showToast("Logged out successfully");
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchProducts();
      await fetchUser();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
      fetchOrders();
    } else {
      setCart([]);
      setWishlist([]);
      setOrders([]);
    }
  }, [user]);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        wishlist,
        setWishlist,
        products,
        orders,
        loading,
        page,
        setPage,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        currentOrderId,
        setCurrentOrderId,
        fetchUser,
        fetchProducts,
        fetchCart,
        fetchWishlist,
        fetchOrders,
        logout,
        cartCount,
        wishlistCount,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
