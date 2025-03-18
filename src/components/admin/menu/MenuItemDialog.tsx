
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { MenuItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemForm } from "./MenuItemForm";
import { MenuItemFormValues } from "./menuItemSchema";
import { uploadImage } from "./MenuItemImageUpload";

interface MenuItemDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingMenuItem: MenuItem | null;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  onClose: () => void;
}

export const MenuItemDialog = ({
  isOpen,
  setIsOpen,
  editingMenuItem,
  setMenuItems,
  onClose
}: MenuItemDialogProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = async (data: MenuItemFormValues, selectedImage: File | null) => {
    try {
      if (selectedImage) {
        setUploadingImage(true);
      }
      
      let imageUrl = data.image_url || null;
      
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      if (editingMenuItem) {
        if (!imageUrl && editingMenuItem.image_url) {
          const oldImagePath = editingMenuItem.image_url.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('site_images')
              .remove([oldImagePath]);
          }
        }
        
        const { error } = await supabase
          .from('menu_items')
          .update({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            image_url: imageUrl,
            is_vegan: data.is_vegan,
            is_spicy: data.is_spicy,
            is_peanut_free: data.is_peanut_free,
            is_gluten_free: data.is_gluten_free,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMenuItem.id);
        
        if (error) throw error;
        
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item.id === editingMenuItem.id ? {
              ...item,
              categorie: data.categorie,
              nom: data.nom,
              description: data.description,
              prix: data.prix,
              image_url: imageUrl,
              is_vegan: data.is_vegan,
              is_spicy: data.is_spicy,
              is_peanut_free: data.is_peanut_free,
              is_gluten_free: data.is_gluten_free
            } : item
          )
        );
        
        toast({
          title: "Item mis à jour",
          description: `"${data.nom}" a été mis à jour avec succès.`
        });
      } else {
        const { data: newItem, error } = await supabase
          .from('menu_items')
          .insert({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            image_url: imageUrl,
            is_vegan: data.is_vegan,
            is_spicy: data.is_spicy,
            is_peanut_free: data.is_peanut_free,
            is_gluten_free: data.is_gluten_free
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setMenuItems(prevItems => [...prevItems, newItem as MenuItem]);
        
        toast({
          title: "Item ajouté",
          description: `"${data.nom}" a été ajouté au menu.`
        });
      }
      
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'item.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">
            {editingMenuItem ? "Modifier un item" : "Ajouter un item"}
          </DialogTitle>
        </DialogHeader>
        
        <MenuItemForm
          editingMenuItem={editingMenuItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsOpen(false);
            onClose();
          }}
          uploadingImage={uploadingImage}
        />
      </DialogContent>
    </Dialog>
  );
};
