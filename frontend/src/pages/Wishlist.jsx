import React from "react";
import { useApp } from "../context/AppContext";
import { apiFetch } from "../services/api";

const Wishlist = () => {
  const { wishlist, fetchWishlist, fetchCart, setPage, showToast } = useApp();

  const handleRemove = async (productId) => {
    try {
      await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
      showToast("Removed from wishlist");
      await fetchWishlist();
    } catch (err) {
      showToast("Failed to remove item", "error");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await apiFetch(`/cart/${productId}`, { method: "POST" });
      await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
      showToast("Moved to cart!");
      await fetchCart();
      await fetchWishlist();
    } catch (err) {
      showToast("Failed to move to cart", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 animate-fade-in space-y-8">
      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#262626]">My Wishlist ❤️</h1>
          <p className="text-xs text-slate-500 mt-1">{wishlist.length} saved products</p>
        </div>
        <button
          onClick={() => setPage("home")}
          className="text-xs font-bold text-[#ff4c24] hover:underline"
        >
          ← Back to home
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 max-w-md mx-auto space-y-3 animate-pop-in">
          <div className="text-5xl">❤️</div>
          <h3 className="text-lg font-bold text-[#262626]">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500">Save products you love and find them here later.</p>
          <button
            onClick={() => setPage("home")}
            className="tomato-btn px-6 py-2.5 rounded-full text-xs font-semibold"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl overflow-hidden card-shadow border border-[#f0f0f0] flex flex-col justify-between"
            >
              <div>
                <img src={p.image} alt={p.name} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-[#ff4c24] font-bold uppercase">{p.category}</span>
                  <h4 className="font-bold text-sm text-[#262626] line-clamp-1">{p.name}</h4>
                  <p className="text-base font-black text-[#ff4c24]">
                    ₹{p.price?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => handleMoveToCart(p._id)}
                  className="tomato-btn w-full py-2 rounded-md font-medium text-xs"
                >
                  Move to Cart 🛒
                </button>
                <button
                  onClick={() => handleRemove(p._id)}
                  className="w-full py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-md font-medium text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
