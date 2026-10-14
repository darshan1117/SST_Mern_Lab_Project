import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const Navbar = () => {
  const {
    user,
    cartCount,
    wishlistCount,
    page,
    setPage,
    logout,
    setShowAuthModal,
    setAuthMode
  } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  const scrollTo = (id) => {
    setPage("home");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-40 border-b border-[#f0f0f0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => {
            setPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cursor-pointer flex items-center select-none"
        >
          <span className="text-[#ff4c24] font-black text-3xl sm:text-4xl tracking-tight">
            ShopKart.
          </span>
        </div>

        {/* Menu Links */}
        <ul className="hidden md:flex items-center space-x-7 text-[#49557e] text-base font-medium">
          <li
            onClick={() => {
              setPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer pb-1 transition-colors hover:text-[#ff4c24] ${
              page === "home" ? "border-b-2 border-[#ff4c24] text-[#ff4c24] font-semibold" : ""
            }`}
          >
            home
          </li>
          <li
            onClick={() => scrollTo("explore-catalogue")}
            className="cursor-pointer pb-1 transition-colors hover:text-[#ff4c24]"
          >
            catalogue
          </li>
          <li
            onClick={() => setPage("wishlist")}
            className={`cursor-pointer pb-1 transition-colors hover:text-[#ff4c24] flex items-center space-x-1 ${
              page === "wishlist" ? "border-b-2 border-[#ff4c24] text-[#ff4c24] font-semibold" : ""
            }`}
          >
            <span>wishlist</span>
            {wishlistCount > 0 && (
              <span className="text-xs bg-[#ffeae6] text-[#ff4c24] px-1.5 py-0.2 rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </li>
          <li
            onClick={() => scrollTo("footer")}
            className="cursor-pointer pb-1 transition-colors hover:text-[#ff4c24]"
          >
            contact us
          </li>
        </ul>

        {/* Right Icons: Search, Basket, Profile */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => scrollTo("explore-catalogue")}
            className="text-[#49557e] hover:text-[#ff4c24] transition-colors"
            title="Search Products"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Basket / Cart Icon */}
          <div
            onClick={() => setPage("cart")}
            className="relative cursor-pointer text-[#49557e] hover:text-[#ff4c24] transition-colors"
            title="Shopping Cart"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff4c24] rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </div>

          {/* Auth Button / Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-[#49557e] hover:text-[#ff4c24] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#fff4f2] text-[#ff4c24] font-bold flex items-center justify-center border border-[#ff4c24]/30">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-pop-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPage("orders");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#49557e] hover:bg-[#fff4f2] hover:text-[#ff4c24] flex items-center space-x-2.5 font-medium"
                  >
                    <span>📦</span>
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      setPage("wishlist");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#49557e] hover:bg-[#fff4f2] hover:text-[#ff4c24] flex items-center space-x-2.5 font-medium"
                  >
                    <span>❤️</span>
                    <span>Wishlist ({wishlistCount})</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 font-medium border-t border-slate-100"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="border border-[#ff4c24] text-[#49557e] hover:bg-[#fff4f2] hover:text-[#ff4c24] font-medium text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-2.5 rounded-full transition-all active:scale-95"
            >
              sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
