import React from "react";

const HeroBanner = () => {
  const scrollToCatalogue = () => {
    const el = document.getElementById("explore-catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 sm:mt-8">
      <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-r from-[#ff4c24] to-[#ff6842] shadow-xl text-white min-h-[400px] sm:min-h-[460px] flex items-center">
        {/* Background Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop')`
          }}
        ></div>

        {/* Left Content */}
        <div className="relative z-10 w-full md:w-3/5 p-6 sm:p-14 space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Order your <br />
            favourite tech here
          </h1>
          <p className="text-white/90 text-xs sm:text-sm lg:text-base max-w-lg leading-relaxed font-light">
            Choose from a diverse catalogue featuring high-fidelity headphones, mechanical keyboards,
            ergonomic mice, and premium accessories. Our mission is to elevate your everyday tech
            experience, one quality product at a time.
          </p>
          <div className="pt-2">
            <button
              onClick={scrollToCatalogue}
              className="bg-white text-[#747474] hover:text-[#ff4c24] font-medium text-xs sm:text-sm px-6 sm:px-9 py-2.5 sm:py-3.5 rounded-full shadow-md hover:bg-slate-50 transition-all active:scale-95"
            >
              View Catalogue
            </button>
          </div>
        </div>

        {/* Right Side Product Artwork */}
        <div className="hidden md:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 w-[340px] lg:w-[420px] h-[340px] lg:h-[420px] items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop"
            alt="Headphones Artwork"
            className="w-full h-full object-cover rounded-full border-8 border-white/20 shadow-2xl transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
