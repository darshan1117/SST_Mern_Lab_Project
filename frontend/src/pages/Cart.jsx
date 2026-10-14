import React from "react";
import { useApp } from "../context/AppContext";
import { apiFetch } from "../services/api";

const Cart = () => {
  const { cart, fetchCart, setPage, showToast } = useApp();

  const handleRemove = async (productId) => {
    try {
      await apiFetch(`/cart/${productId}`, { method: "DELETE" });
      await fetchCart();
      showToast("Item removed from cart");
    } catch (err) {
      showToast("Failed to remove item", "error");
    }
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 animate-fade-in space-y-10">
      <h1 className="text-3xl font-extrabold text-[#262626]">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 max-w-md mx-auto space-y-4 animate-pop-in">
          <div className="text-6xl">🛒</div>
          <h3 className="text-xl font-bold text-[#262626]">Your cart is empty</h3>
          <p className="text-xs text-slate-500">
            Explore our catalogue and add products to your cart.
          </p>
          <button
            onClick={() => setPage("home")}
            className="tomato-btn font-medium text-xs px-6 py-2.5 rounded-full"
          >
            Browse Catalogue
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#49557e]">
              <thead className="border-b border-slate-200 text-slate-400 font-medium">
                <tr>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cart.map((item) => {
                  const p = item.product || {};
                  const itemTotal = (p.price || 0) * item.quantity;

                  return (
                    <tr key={p._id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-14 object-cover rounded-xl"
                        />
                      </td>
                      <td className="py-4 font-medium text-[#262626]">{p.name}</td>
                      <td className="py-4">₹{p.price?.toLocaleString("en-IN")}</td>
                      <td className="py-4 font-bold text-[#262626]">{item.quantity}</td>
                      <td className="py-4 font-bold text-[#262626]">
                        ₹{itemTotal?.toLocaleString("en-IN")}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleRemove(p._id)}
                          className="text-slate-400 hover:text-[#ff4c24] font-bold text-lg px-2"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Layout: Promo Code + Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
            {/* Cart Totals */}
            <div className="order-2 md:order-1 space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-[#262626]">Cart Totals</h3>
              <div className="space-y-3 text-sm text-[#49557e] divide-y divide-slate-100">
                <div className="flex justify-between pt-2">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#262626]">
                    ₹{subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-base text-[#262626]">
                  <span>Total</span>
                  <span>₹{total?.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button
                onClick={() => setPage("checkout")}
                className="tomato-btn w-full py-3.5 rounded-md font-medium text-xs tracking-wider uppercase shadow-md"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>

            {/* Promo Code Box */}
            <div className="order-1 md:order-2 space-y-2 max-w-md md:ml-auto">
              <p className="text-xs text-slate-500">If you have a promo code, Enter it here</p>
              <div className="flex bg-[#eaeaea] rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="promo code"
                  className="bg-transparent px-4 py-2.5 text-xs text-[#262626] focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => showToast("Promo code feature coming soon!")}
                  className="bg-black text-white text-xs px-6 py-2.5 font-medium hover:bg-slate-800 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
