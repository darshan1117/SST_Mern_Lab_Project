import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-[#32324d] text-white/80 pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4 md:col-span-2">
          <span className="text-[#ff4c24] font-black text-3xl">ShopKart.</span>
          <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed font-light">
            ShopKart is your premier full-stack e-commerce customer portal powered by Node.js, Express,
            MongoDB, and React. Engineered strictly following Labs 01 to 06.
          </p>
          <div className="flex space-x-3 pt-2">
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:border-[#ff4c24] hover:text-[#ff4c24] transition-colors text-xs font-bold">
              f
            </span>
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:border-[#ff4c24] hover:text-[#ff4c24] transition-colors text-xs font-bold">
              in
            </span>
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:border-[#ff4c24] hover:text-[#ff4c24] transition-colors text-xs font-bold">
              𝕏
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-bold text-base uppercase tracking-wider">SHOPKART</h4>
          <ul className="space-y-2 text-xs sm:text-sm font-light">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Catalogue</li>
            <li className="hover:text-white cursor-pointer">Wishlist</li>
            <li className="hover:text-white cursor-pointer">My Orders</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-bold text-base uppercase tracking-wider">GET IN TOUCH</h4>
          <ul className="space-y-2 text-xs sm:text-sm font-light">
            <li>+91-9876543210</li>
            <li>support@shopkart.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/50">
        Copyright 2026 © ShopKart.com — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
