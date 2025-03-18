
import React from "react";
import { MenuItem } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Leaf, Flame, NutOff, WheatOff } from "lucide-react";

interface MenuItemDetailProps {
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
}

const MenuItemDetail = ({ selectedItem, setSelectedItem }: MenuItemDetailProps) => {
  return (
    <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
      <DialogContent className="sm:max-w-[500px]">
        {selectedItem && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-playfair font-bold text-secondary">
                {selectedItem.nom}
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              {/* Image */}
              {selectedItem.image_url && (
                <div className="mb-4 rounded-md overflow-hidden h-56">
                  <img 
                    src={selectedItem.image_url} 
                    alt={selectedItem.nom}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Price */}
              <div className="text-xl font-bold text-primary mb-3">
                {selectedItem.prix} CAD
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-2">Description</h3>
                <p className="text-foreground/80">{selectedItem.description}</p>
              </div>
              
              {/* Dietary Options */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Options alimentaires</h3>
                <div className="space-y-2">
                  {selectedItem.is_vegan && (
                    <div className="flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <span>Végétarien</span>
                    </div>
                  )}
                  
                  {selectedItem.is_spicy && (
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-red-600" />
                      <span>Épicé</span>
                    </div>
                  )}
                  
                  {selectedItem.is_peanut_free && (
                    <div className="flex items-center gap-2">
                      <NutOff className="w-5 h-5 text-amber-600" />
                      <span>Sans Cacahuètes</span>
                    </div>
                  )}
                  
                  {selectedItem.is_gluten_free && (
                    <div className="flex items-center gap-2">
                      <WheatOff className="w-5 h-5 text-yellow-600" />
                      <span>Sans Gluten</span>
                    </div>
                  )}
                  
                  {!selectedItem.is_vegan && !selectedItem.is_spicy && 
                   !selectedItem.is_peanut_free && !selectedItem.is_gluten_free && (
                    <p className="text-gray-500">Aucune option spéciale</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDetail;
