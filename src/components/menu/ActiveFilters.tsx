
import React from "react";
import { FilterOptions } from "./MenuFilter";
import { Leaf, Flame, NutOff, WheatOff } from "lucide-react";

interface ActiveFiltersProps {
  filters: FilterOptions;
}

const ActiveFilters = ({ filters }: ActiveFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(Boolean);
  
  if (!hasActiveFilters) return null;
  
  return (
    <div className="mb-4 flex flex-wrap gap-2 text-sm">
      <span className="text-muted-foreground">Filtres actifs:</span>
      {filters.isVegan && (
        <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Leaf size={12} className="text-green-600" />
          Végétarien
        </span>
      )}
      {filters.isGlutenFree && (
        <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <WheatOff size={12} className="text-yellow-600" />
          Sans Gluten
        </span>
      )}
      {filters.isPeanutFree && (
        <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <NutOff size={12} className="text-amber-600" />
          Sans Arachides
        </span>
      )}
      {filters.isSpicy && (
        <span className="bg-muted px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Flame size={12} className="text-red-600" />
          Épicé
        </span>
      )}
    </div>
  );
};

export default ActiveFilters;
