import React from "react";
import { useApp } from "../context/AppContext";

const OrderSuccess = () => {
  const { setPage, currentOrderId } = useApp();

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center animate-pop-in space-y-4">
      <div className="w-16 h-16 bg-[#e7f8ee] text-[#2e7d32] rounded-full flex items-center justify-center text-3xl mx-auto font-black">
        ✓
      </div>
      <h1 className="text-3xl font-extrabold text-[#262626]">Order Placed!</h1>
      <p className="text-xs text-slate-500 max-w-xs mx-auto">
        Your payment was verified and order{" "}
        <span className="font-mono font-bold text-slate-800">#{currentOrderId}</span> has been
        confirmed.
      </p>
      <div className="pt-4 flex justify-center space-x-3">
        <button
          onClick={() => setPage("orders")}
          className="tomato-btn px-6 py-2.5 rounded-full text-xs font-semibold"
        >
          My Orders
        </button>
        <button
          onClick={() => setPage("home")}
          className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-slate-200"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
