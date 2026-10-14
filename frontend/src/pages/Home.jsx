import React, { useState } from "react";
import HeroBanner from "../components/HeroBanner";
import ExploreCatalogue from "../components/ExploreCatalogue";
import ProductDisplay from "../components/ProductDisplay";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <>
      <HeroBanner />
      <ExploreCatalogue
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <ProductDisplay activeCategory={activeCategory} />
    </>
  );
};

export default Home;
