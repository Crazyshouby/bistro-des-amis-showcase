
import React from "react";
import { MenuItem } from "@/types";
import AnimatedSection from "@/components/shared/AnimatedSection";

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
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full cursor-pointer"
            onClick={() => onItemClick(item)}
          >
            <div className="relative h-40 bg-gray-100">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400">Aucune image</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-bistro-wood truncate" title={item.nom}>
                  {item.nom}
                </h3>
                <span className="font-bold text-bistro-olive">{item.prix} CAD</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 overflow-hidden" title={item.description}>
                {item.description}
              </p>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default MenuGrid;
