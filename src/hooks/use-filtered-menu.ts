
import { useState, useMemo } from 'react';
import { MenuItem } from '@/types';
import { filterMenuItems, CATEGORY_ORDER } from '@/lib/menu-utils';
import { FilterOptions } from '@/components/menu/MenuFilter';

export const useFilteredMenu = (menuItems: MenuItem[]) => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    isVegan: false,
    isGlutenFree: false,
    isPeanutFree: false,
    isSpicy: false
  });

  // Get unique categories from menu items and sort them based on predefined order
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(menuItems.map((item) => item.categorie))
    );
    return uniqueCategories.sort(
      (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
    );
  }, [menuItems]);

  // Filter menu items based on active category and dietary filters
  const filteredItems = useMemo(() => {
    return filterMenuItems(menuItems, activeCategory, filters);
  }, [menuItems, activeCategory, filters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(Boolean);
  }, [filters]);

  // Toggle a filter
  const toggleFilter = (filterName: keyof FilterOptions) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      isVegan: false,
      isGlutenFree: false,
      isPeanutFree: false,
      isSpicy: false
    });
  };

  return {
    activeCategory,
    setActiveCategory,
    filters,
    toggleFilter,
    clearFilters,
    hasActiveFilters,
    categories,
    filteredItems
  };
};
