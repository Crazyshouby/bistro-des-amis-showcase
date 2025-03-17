
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/types";
import { Leaf, Flame, NutOff, WheatOff } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete?: (id: string) => void;
}

export const MenuItemCard = ({ item, onEdit, onDelete }: MenuItemCardProps) => {
  return (
    <div 
      key={item.id} 
      className="bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer border-gray-200 overflow-hidden"
      onClick={() => onEdit && onEdit(item)}
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
        <p className="text-sm text-gray-600 line-clamp-2 h-10" title={item.description}>
          {item.description}
        </p>
        
        <div className="flex mt-2 gap-2">
          {item.is_vegan && (
            <div className="flex items-center">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
          )}
          
          {item.is_spicy && (
            <div className="flex items-center">
              <Flame className="w-4 h-4 text-red-600" />
            </div>
          )}
          
          {item.is_peanut_free && (
            <div className="flex items-center">
              <NutOff className="w-4 h-4 text-amber-600" />
            </div>
          )}
          
          {item.is_gluten_free && (
            <div className="flex items-center">
              <WheatOff className="w-4 h-4 text-yellow-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
