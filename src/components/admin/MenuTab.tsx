
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, Leaf, Flame, NutOff, WheatOff } from "lucide-react";
import { MenuItem } from "@/types";
import { MenuItemDialog } from "./menu/MenuItemDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MenuTabProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  onDeleteRequest: (type: 'menu' | 'event', id: string) => void;
}

// Fixed category order
const CATEGORY_ORDER = ["Apéritifs", "Entrées", "Plats", "Desserts", "Boissons"];

export const MenuTab = ({ menuItems, setMenuItems, onDeleteRequest }: MenuTabProps) => {
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
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

  const renderMenuItemCard = (item: MenuItem) => (
    <div 
      key={item.id} 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
      onClick={() => handleEditMenuItem(item)}
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
        <div className="absolute top-2 right-2 flex gap-1">
          <Button 
            variant="outline" 
            size="icon"
            className="h-7 w-7 bg-white hover:bg-red-500 hover:text-white border-red-500 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest('menu', item.id);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
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

  const renderMenuItemTable = (categoryItems: MenuItem[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Options</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun item dans cette catégorie.
              </TableCell>
            </TableRow>
          ) : (
            categoryItems.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => handleEditMenuItem(item)}>
                <TableCell>
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.nom}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-bistro-wood/50 text-sm">Aucune image</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.nom}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell>{item.prix} CAD</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {item.is_vegan && <Leaf className="w-4 h-4 text-green-600" />}
                    {item.is_spicy && <Flame className="w-4 h-4 text-red-600" />}
                    {item.is_peanut_free && <NutOff className="w-4 h-4 text-amber-600" />}
                    {item.is_gluten_free && <WheatOff className="w-4 h-4 text-yellow-600" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRequest('menu', item.id);
                    }}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderCategoryContent = (categoryItems: MenuItem[]) => {
    return isMobile 
      ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categoryItems.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              Aucun item dans cette catégorie.
            </div>
          ) : (
            categoryItems.map(item => renderMenuItemCard(item))
          )}
        </div>
      ) 
      : renderMenuItemTable(categoryItems);
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
          <Tabs defaultValue={availableCategories[0] || "Apéritifs"} className="w-full">
            <TabsList className={`mb-4 w-full grid ${isMobile ? 'grid-cols-2 flex-wrap gap-2' : `grid-cols-${availableCategories.length > 0 ? Math.min(availableCategories.length, 5) : 5}`}`}>
              {availableCategories.map(category => (
                <TabsTrigger key={category} value={category} className={isMobile ? "text-xs py-1 px-2" : ""}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {availableCategories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                {renderCategoryContent(menuItemsByCategory[category])}
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
