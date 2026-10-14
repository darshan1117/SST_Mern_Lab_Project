import React from "react";

const categoryIcons = {
  "Audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop",
  "Keyboards": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop",
  "Mice": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop",
  "Displays": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop",
  "Wearables": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop",
  "Fashion": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop",
  "Home": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop"
};

const ExploreCatalogue = ({ activeCategory, setActiveCategory }) => {
  const categories = ["Audio", "Keyboards", "Mice", "Displays", "Wearables", "Fashion", "Home"];

  return (
    <section id="explore-catalogue" className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-6 space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#262626]">Explore our catalogue</h2>
      <p className="text-[#808080] text-sm sm:text-base max-w-2xl font-light leading-relaxed">
        Choose from a diverse collection featuring flagship electronics, workstation accessories, and lifestyle essentials.
      </p>

      {/* Circular Category Badges */}
      <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto py-6 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          const img = categoryIcons[cat] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300";

          return (
            <div
              key={cat}
              onClick={() => setActiveCategory((prev) => (prev === cat ? "All" : cat))}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group text-center select-none"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "border-[3.5px] border-[#ff4c24] p-1"
                    : "p-0.5 border border-transparent group-hover:scale-105"
                }`}
              >
                <img src={img} alt={cat} className="w-full h-full object-cover rounded-full" />
              </div>
              <span
                className={`mt-3 text-sm font-medium transition-colors ${
                  isSelected ? "text-[#ff4c24] font-bold" : "text-[#747474] group-hover:text-[#262626]"
                }`}
              >
                {cat}
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-[1px] bg-[#e2e2e2] w-full my-6"></div>
    </section>
  );
};

export default ExploreCatalogue;
