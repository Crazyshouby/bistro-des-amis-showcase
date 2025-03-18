
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuItem } from "@/types";
import { menuItemSchema, MenuItemFormValues, defaultFormValues } from "./menuItemSchema";
import { MenuItemImageUpload } from "./MenuItemImageUpload";
import { DialogFooter } from "@/components/ui/dialog";

interface MenuItemFormProps {
  editingMenuItem: MenuItem | null;
  onSubmit: (data: MenuItemFormValues, selectedImage: File | null) => Promise<void>;
  onCancel: () => void;
  uploadingImage: boolean;
  uploadProgress?: number;
}

export const MenuItemForm = ({
  editingMenuItem,
  onSubmit,
  onCancel,
  uploadingImage,
  uploadProgress = 0
}: MenuItemFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: defaultFormValues
  });

  useEffect(() => {
    if (editingMenuItem) {
      form.reset({
        id: editingMenuItem.id,
        categorie: editingMenuItem.categorie,
        nom: editingMenuItem.nom,
        description: editingMenuItem.description,
        prix: editingMenuItem.prix,
        image_url: editingMenuItem.image_url || "",
        is_vegan: editingMenuItem.is_vegan || false,
        is_spicy: editingMenuItem.is_spicy || false,
        is_peanut_free: editingMenuItem.is_peanut_free || false,
        is_gluten_free: editingMenuItem.is_gluten_free || false
      });
      
      if (editingMenuItem.image_url) {
        setImagePreview(editingMenuItem.image_url);
      } else {
        setImagePreview(null);
      }
    } else {
      form.reset(defaultFormValues);
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [editingMenuItem, form]);

  const handleImageChange = (imageFile: File | null, preview: string | null) => {
    setSelectedImage(imageFile);
    setImagePreview(preview);
    if (!imageFile && editingMenuItem?.image_url) {
      form.setValue('image_url', '');
    }
  };

  const handleFormSubmit = async (data: MenuItemFormValues) => {
    await onSubmit(data, selectedImage);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categorie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="Apéritifs">Apéritifs</option>
                  <option value="Entrées">Entrées</option>
                  <option value="Plats">Plats</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Boissons">Boissons</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de l'item" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de l'item"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="prix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix (CAD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Prix"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <MenuItemImageUpload 
          initialImageUrl={editingMenuItem?.image_url || null}
          onImageChange={handleImageChange}
          uploadingImage={uploadingImage}
          uploadProgress={uploadProgress}
        />
        
        <div className="space-y-4">
          <FormLabel>Options alimentaires</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="is_vegan"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Végétalien
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_spicy"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Épicé
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_peanut_free"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Sans cacahuètes
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="is_gluten_free"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Sans gluten
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
            disabled={uploadingImage}
          >
            {editingMenuItem ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
