
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

const MenuItemCard = ({ item, className }: MenuItemCardProps) => {
  return (
    <div className={cn(
      "menu-item-card group",
      className
    )}>
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
  );
};

export default MenuItemCard;
