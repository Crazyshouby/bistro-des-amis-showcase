
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import { Leaf, Flame, NutOff, WheatOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
          <div>
            <h3 className="text-xl font-playfair font-bold text-bistro-wood group-hover:text-bistro-brick transition-colors duration-300">
              {item.nom}
            </h3>
            <div className="flex space-x-1 mt-1">
              {item.is_vegan && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><Leaf className="w-4 h-4 text-green-600" /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Végétalien</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {item.is_spicy && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><Flame className="w-4 h-4 text-red-600" /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Épicé</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {item.is_peanut_free && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><NutOff className="w-4 h-4 text-amber-600" /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sans Cacahuètes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {item.is_gluten_free && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span><WheatOff className="w-4 h-4 text-yellow-600" /></span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sans Gluten</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
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
