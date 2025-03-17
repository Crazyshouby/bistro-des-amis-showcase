
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

const MenuItemCard = ({ item, className }: MenuItemCardProps) => {
  return (
    <div className={cn(
      "menu-item-card group flex items-start gap-4",
      className
    )}>
      {/* Image Section */}
      <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.nom}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-bistro-sand/30 flex items-center justify-center">
            <span className="text-xs text-bistro-wood/50">No image</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-playfair font-bold text-bistro-wood group-hover:text-bistro-brick transition-colors duration-300">
            {item.nom}
          </h3>
          <span className="menu-item-price text-lg">
            {item.prix} CAD
          </span>
        </div>
        <p className="text-sm text-bistro-wood/80">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default MenuItemCard;
