
import { MenuItem } from "@/types";
import { FilterOptions } from "@/components/menu/MenuFilter";

// Définition de l'ordre fixe des catégories
export const CATEGORY_ORDER = ["Apéritifs", "Entrées", "Plats", "Desserts", "Boissons"];

// Filter menu items based on category and dietary options
export const filterMenuItems = (
  items: MenuItem[], 
  activeCategory: string,
  filters: FilterOptions
): MenuItem[] => {
  // First filter by category if one is selected
  let filtered = activeCategory
    ? items.filter((item) => item.categorie === activeCategory)
    : items;
  
  // Then apply dietary filters if any are active
  const hasActiveFilters = Object.values(filters).some(Boolean);
  
  if (hasActiveFilters) {
    filtered = filtered.filter(item => {
      if (filters.isVegan && !item.is_vegan) return false;
      if (filters.isGlutenFree && !item.is_gluten_free) return false;
      if (filters.isPeanutFree && !item.is_peanut_free) return false;
      if (filters.isSpicy && !item.is_spicy) return false;
      return true;
    });
  }
  
  return filtered;
};

