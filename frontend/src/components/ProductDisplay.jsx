import React from "react";
import { useApp } from "../context/AppContext";
import { apiFetch } from "../services/api";

const ProductDisplay = ({ activeCategory }) => {
  const {
    products,
    cart,
    wishlist,
    fetchCart,
    fetchWishlist,
    user,
    setShowAuthModal,
    showToast
  } = useApp();

  const getItemQuantity = (productId) => {
    const item = cart.find((c) => (c.product?._id || c.product) === productId);
    return item ? item.quantity : 0;
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const handleAdd = async (productId) => {
    if (!user) {
      showToast("Please sign in to add items to cart", "error");
      return setShowAuthModal(true);
    }
    try {
      const res = await apiFetch(`/cart/${productId}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        await fetchCart();
      } else {
        showToast(data.message || "Failed to add", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    }
  };

  const handleUpdateQty = async (productId, currentQty, delta) => {
    if (!user) return setShowAuthModal(true);
    const newQty = currentQty + delta;
    try {
      if (newQty <= 0) {
        await apiFetch(`/cart/${productId}`, { method: "DELETE" });
      } else {
        const res = await apiFetch(`/cart/${productId}`, {
          method: "PATCH",
          body: JSON.stringify({ quantity: newQty })
        });
        const data = await res.json();
        if (!res.ok) {
          showToast(data.message || "Stock limit reached", "error");
        }
      }
      await fetchCart();
    } catch (err) {
      showToast("Network error", "error");
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      showToast("Please sign in to save wishlist items", "error");
      return setShowAuthModal(true);
    }
    try {
      const res = await apiFetch(`/wishlist/${productId}/toggle`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        showToast(data.saved ? "Added to wishlist ♥" : "Removed from wishlist");
        await fetchWishlist();
      } else {
        showToast(data.message || "Failed to update wishlist", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    }
  };

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#262626]">Top products for you</h2>
        <span className="text-xs text-[#747474] font-medium">
          {filtered.length} products available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {filtered.map((product) => {
          const qty = getItemQuantity(product._id);
          const wish = isWishlisted(product._id);

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden card-shadow flex flex-col justify-between border border-[#f0f0f0]"
            >
              {/* Image & Badges */}
              <div className="relative h-48 sm:h-52 overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Wishlist Heart Icon (Lab 04) */}
                <button
                  onClick={() => handleToggleWishlist(product._id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all active:scale-125 ${
                    wish
                      ? "bg-rose-500 text-white shadow-md"
                      : "bg-white/90 text-slate-600 hover:bg-white"
                  }`}
                  title={wish ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {wish ? "♥" : "♡"}
                </button>

                {/* Floating Counter Button in Image Corner */}
                <div className="absolute bottom-3 right-3 select-none">
                  {qty === 0 ? (
                    <button
                      onClick={() => handleAdd(product._id)}
                      className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#ff4c24] hover:bg-[#fff4f2] hover:scale-110 active:scale-90 transition-all font-bold text-xl"
                      title="Add to cart"
                    >
                      +
                    </button>
                  ) : (
                    <div className="flex items-center bg-white p-1 rounded-full shadow-lg border border-slate-100 space-x-2">
                      <button
                        onClick={() => handleUpdateQty(product._id, qty, -1)}
                        className="w-7 h-7 rounded-full bg-[#ffeae6] text-[#ff4c24] font-black flex items-center justify-center hover:bg-[#ff4c24] hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#262626] px-1">{qty}</span>
                      <button
                        onClick={() => handleUpdateQty(product._id, qty, 1)}
                        className="w-7 h-7 rounded-full bg-[#e7f8ee] text-[#2e7d32] font-black flex items-center justify-center hover:bg-[#2e7d32] hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3
                    className="font-bold text-base sm:text-lg text-[#262626] truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h3>
                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                </div>

                <p className="text-[#676767] text-xs leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[#ff4c24] font-black text-xl">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                      product.stock > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductDisplay;
