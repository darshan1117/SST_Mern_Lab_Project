import React from "react";
import { useApp } from "../context/AppContext";

const Orders = () => {
  const { orders, setPage } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[#262626]">My Orders</h1>
        <button
          onClick={() => setPage("home")}
          className="text-xs font-semibold text-[#ff4c24] hover:underline"
        >
          ← Back to catalogue
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 max-w-md mx-auto space-y-3">
          <div className="text-5xl">📦</div>
          <h3 className="text-lg font-bold text-[#262626]">No orders placed yet</h3>
          <p className="text-xs text-slate-500">Explore products from the catalogue to place an order.</p>
          <button
            onClick={() => setPage("home")}
            className="tomato-btn px-5 py-2 rounded-full text-xs"
          >
            Explore Catalogue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 card-shadow bg-white text-xs"
            >
              <div className="flex items-center space-x-4">
                <span className="text-3xl">📦</span>
                <div>
                  <p className="font-bold text-sm text-[#262626] line-clamp-1">
                    {order.items?.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
                  </p>
                  <p className="text-slate-400 mt-0.5">Order ID: #{order._id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-[#262626]">
                <span className="font-bold text-sm">
                  ₹{order.totalAmount?.toLocaleString("en-IN")}
                </span>
                <span className="text-slate-500">Items: {order.items?.length || 0}</span>
                <span className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{order.status}</span>
                </span>
                <span className="bg-[#e7f8ee] text-[#2e7d32] px-2.5 py-1 rounded-md font-bold text-[11px]">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
