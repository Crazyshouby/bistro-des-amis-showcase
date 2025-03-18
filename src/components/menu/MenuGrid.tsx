
import React from "react";
import { MenuItem } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { MenuItemCard } from "@/components/admin/menu/MenuItemCard";

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

const MenuGrid = ({ items, onItemClick }: MenuGridProps) => {
  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground col-span-2 py-8">
        Aucun élément trouvé correspondant aux critères de filtrage.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item) => (
        <AnimatedSection key={item.id} delay={0.1} className="h-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="relative">
              <MenuItemCard 
                item={item}
                onEdit={() => onItemClick(item)} 
              />
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default MenuGrid;
