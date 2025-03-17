
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, Leaf, Flame, NutOff, WheatOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuItem } from "@/types";
import { MenuItemDialog } from "./MenuItemDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuTabProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  onDeleteRequest: (type: 'menu' | 'event', id: string) => void;
}

export const MenuTab = ({ menuItems, setMenuItems, onDeleteRequest }: MenuTabProps) => {
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

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
  const categories = ["Apéritifs", "Entrées", "Plats", "Desserts", "Boissons"];
  const menuItemsByCategory = categories.reduce((acc, category) => {
    acc[category] = menuItems.filter(item => item.categorie === category);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const renderCategoryTable = (categoryItems: MenuItem[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Prix (CAD)</TableHead>
          <TableHead>Image</TableHead>
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
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.nom}</TableCell>
              <TableCell className="max-w-xs truncate">{item.description}</TableCell>
              <TableCell>{item.prix}</TableCell>
              <TableCell>
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.nom}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <span className="text-bistro-wood/50 text-sm">Aucune image</span>
                )}
              </TableCell>
              <TableCell className="space-x-1">
                <TooltipProvider>
                  {item.is_vegan && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Leaf className="inline-block w-4 h-4 text-green-600" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Végétalien</TooltipContent>
                    </Tooltip>
                  )}
                  
                  {item.is_spicy && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Flame className="inline-block w-4 h-4 text-red-600" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Épicé</TooltipContent>
                    </Tooltip>
                  )}
                  
                  {item.is_peanut_free && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <NutOff className="inline-block w-4 h-4 text-amber-600" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Sans cacahuètes</TooltipContent>
                    </Tooltip>
                  )}
                  
                  {item.is_gluten_free && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <WheatOff className="inline-block w-4 h-4 text-yellow-600" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Sans gluten</TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditMenuItem(item)}
                  className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDeleteRequest('menu', item.id)}
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
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Menu</CardTitle>
          <Button 
            onClick={handleAddMenuItem}
            className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un item
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Apéritifs" className="w-full">
            <TabsList className="mb-4 w-full grid grid-cols-5">
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="rounded-md border">
                  {renderCategoryTable(menuItemsByCategory[category])}
                </div>
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
