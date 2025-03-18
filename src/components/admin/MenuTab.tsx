
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MenuItem } from "@/types";
import { MenuItemDialog } from "./menu/MenuItemDialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { CategorySelector } from "./menu/CategorySelector";
import { MenuCategoryContent } from "./menu/MenuCategoryContent";

// Fixed category order
const CATEGORY_ORDER = ["Apéritifs", "Entrées", "Plats", "Desserts", "Boissons"];

interface MenuTabProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  onDeleteRequest: (type: 'menu' | 'event', id: string) => void;
}

export const MenuTab = ({ menuItems, setMenuItems, onDeleteRequest }: MenuTabProps) => {
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const isMobile = useIsMobile();

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setIsMenuItemDialogOpen(true);
  };
  
  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    setIsMenuItemDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsMenuItemDialogOpen(false);
    setEditingMenuItem(null);
  };

  // Group menu items by category
  const menuItemsByCategory = CATEGORY_ORDER.reduce((acc, category) => {
    const items = menuItems.filter(item => item.categorie === category);
    if (items.length > 0) {
      acc[category] = items;
    }
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Only show categories that have items
  const availableCategories = Object.keys(menuItemsByCategory);
  
  // Set default active category if not set yet
  if (!activeCategory && availableCategories.length > 0) {
    setActiveCategory(availableCategories[0]);
  }

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Menu</CardTitle>
          <Button 
            onClick={handleAddMenuItem}
            className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un item
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={availableCategories[0] || "Apéritifs"} 
            value={activeCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <CategorySelector
              categories={availableCategories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              isMobile={isMobile}
            />
            
            {availableCategories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                <MenuCategoryContent
                  items={menuItemsByCategory[category]}
                  isMobile={isMobile}
                  onEditItem={handleEditMenuItem}
                  onDeleteItem={(id) => onDeleteRequest('menu', id)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <MenuItemDialog 
        isOpen={isMenuItemDialogOpen}
        setIsOpen={setIsMenuItemDialogOpen}
        editingMenuItem={editingMenuItem}
        setMenuItems={setMenuItems}
        onClose={handleCloseDialog}
      />
    </>
  );
};
