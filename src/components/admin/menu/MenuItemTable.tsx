
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MenuItem } from "@/types";
import { Leaf, Flame, NutOff, WheatOff, Trash } from "lucide-react";

interface MenuItemTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export const MenuItemTable = ({ items, onEdit, onDelete }: MenuItemTableProps) => {
  return (
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
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun item dans cette catégorie.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => onEdit(item)}>
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
                      onDelete(item.id);
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
};
