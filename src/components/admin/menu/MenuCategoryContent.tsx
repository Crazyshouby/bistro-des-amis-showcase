
import { MenuItem } from "@/types";
import { MenuItemCard } from "./MenuItemCard";
import { MenuItemTable } from "./MenuItemTable";

interface MenuCategoryContentProps {
  items: MenuItem[];
  isMobile: boolean;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export const MenuCategoryContent = ({ 
  items, 
  isMobile, 
  onEditItem, 
  onDeleteItem 
}: MenuCategoryContentProps) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            Aucun item dans cette catégorie.
          </div>
        ) : (
          items.map(item => (
            <MenuItemCard 
              key={item.id}
              item={item} 
              onEdit={onEditItem} 
              onDelete={onDeleteItem} 
            />
          ))
        )}
      </div>
    );
  }

  return <MenuItemTable items={items} onEdit={onEditItem} onDelete={onDeleteItem} />;
};
