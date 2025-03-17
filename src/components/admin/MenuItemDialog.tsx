import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { MenuItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const menuItemSchema = z.object({
  id: z.string().optional(),
  categorie: z.string().min(1, "La catégorie est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  prix: z.coerce.number().min(0, "Le prix doit être positif"),
  image_url: z.string().optional(),
  is_vegan: z.boolean().optional().default(false),
  is_spicy: z.boolean().optional().default(false),
  is_peanut_free: z.boolean().optional().default(false),
  is_gluten_free: z.boolean().optional().default(false)
});

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categorie: "Apéritifs",
      nom: "",
      description: "",
      prix: 0,
      image_url: "",
      is_vegan: false,
      is_spicy: false,
      is_peanut_free: false,
      is_gluten_free: false
    }
  });

  useEffect(() => {
    if (isOpen && editingMenuItem) {
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
    } else if (isOpen) {
      form.reset({
        categorie: "Apéritifs",
        nom: "",
        description: "",
        prix: 0,
        image_url: "",
        is_vegan: false,
        is_spicy: false,
        is_peanut_free: false,
        is_gluten_free: false
      });
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [isOpen, editingMenuItem, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (editingMenuItem && editingMenuItem.image_url) {
      form.setValue('image_url', '');
    }
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `menu_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('event_images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('event_images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'upload de l'image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof menuItemSchema>) => {
    try {
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
              .from('event_images')
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
      
      setSelectedImage(null);
      setImagePreview(null);
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'item.",
        variant: "destructive",
      });
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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <div className="space-y-2">
              <FormLabel>Image</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50">
                    <span className="text-sm text-gray-500">Aucune image</span>
                  </div>
                )}
                
                <div>
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingImage ? "Chargement..." : "Choisir une image"}
                  </Button>
                </div>
              </div>
            </div>
            
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
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
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
      </DialogContent>
    </Dialog>
  );
};
