
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, Leaf, Flame, NutOff, WheatOff } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuItem } from "@/types";
import { MenuItemDialog } from "./MenuItemDialog";

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prix (CAD)</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Options</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Aucun item dans le menu. Cliquez sur "Ajouter un item" pour commencer.
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.categorie}</TableCell>
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
                      {item.is_vegan && <Leaf className="inline-block w-4 h-4 text-green-600" />}
                      {item.is_spicy && <Flame className="inline-block w-4 h-4 text-red-600" />}
                      {item.is_peanut_free && <NutOff className="inline-block w-4 h-4 text-amber-600" />}
                      {item.is_gluten_free && <WheatOff className="inline-block w-4 h-4 text-yellow-600" />}
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
