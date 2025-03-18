
import React from "react";
import { FilterOptions, MenuFilter } from "./MenuFilter";
import MenuCategorySelector from "./MenuCategorySelector";
import ActiveFilters from "./ActiveFilters";

interface MenuControlsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const MenuControls = ({
  categories,
  activeCategory,
  setActiveCategory,
  filters,
  onFilterChange
}: MenuControlsProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
        {/* Category Filter Buttons */}
        <MenuCategorySelector 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        {/* Filter Button */}
        <MenuFilter 
          onFilterChange={onFilterChange}
          activeFilters={filters}
        />
      </div>
      
      {/* Active filters summary */}
      <ActiveFilters filters={filters} />
    </div>
  );
};

export default MenuControls;
