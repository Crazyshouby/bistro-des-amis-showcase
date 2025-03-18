
import React from "react";

interface MenuCategorySelectorProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const MenuCategorySelector = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}: MenuCategorySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            activeCategory === category
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default MenuCategorySelector;
