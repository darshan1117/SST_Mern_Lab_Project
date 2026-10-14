import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const fetchCart = async () => {
    if (!user) return setCart([]);
    setLoadingCart(true);
    try {
      const res = await fetch("/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoadingCart(false);
    }
  };

  const fetchWishlist = async () => {
    if (!user) return setWishlist([]);
    setLoadingWishlist(true);
    try {
      const res = await fetch("/wishlist");
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  const addToCart = async (productId) => {
    const res = await fetch(`/cart/${productId}`, { method: "POST" });
    const data = await res.json();
    if (res.ok && data.success) {
      setCart(data.cart || []);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await fetch(`/cart/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setCart(data.cart || []);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const removeFromCart = async (productId) => {
    const res = await fetch(`/cart/${productId}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok && data.success) {
      setCart(data.cart || []);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const clearCartState = () => {
    setCart([]);
  };

  const toggleWishlist = async (productId) => {
    const res = await fetch(`/wishlist/${productId}/toggle`, { method: "PATCH" });
    const data = await res.json();
    if (res.ok && data.success) {
      await fetchWishlist();
      return { success: true, saved: data.saved };
    }
    return { success: false, message: data.message };
  };

  const removeFromWishlist = async (productId) => {
    const res = await fetch(`/wishlist/${productId}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok && data.success) {
      await fetchWishlist();
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * (item.quantity || 1);
  }, 0);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        cartSubtotal,
        loadingCart,
        loadingWishlist,
        fetchCart,
        fetchWishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCartState,
        toggleWishlist,
        removeFromWishlist
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);
