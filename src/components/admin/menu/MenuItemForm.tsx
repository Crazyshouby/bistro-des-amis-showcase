
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { MenuItem } from "@/types";
import { menuItemSchema, MenuItemFormValues, defaultFormValues } from "./menuItemSchema";
import { MenuItemImageUpload } from "./MenuItemImageUpload";
import { BasicFormFields } from "./BasicFormFields";
import { DietaryOptions } from "./DietaryOptions";
import { FormActions } from "./FormActions";

interface MenuItemFormProps {
  editingMenuItem: MenuItem | null;
  onSubmit: (data: MenuItemFormValues, selectedImage: File | null) => Promise<void>;
  onCancel: () => void;
  uploadingImage: boolean;
}

export const MenuItemForm = ({
  editingMenuItem,
  onSubmit,
  onCancel,
  uploadingImage
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
        <BasicFormFields form={form} />
        
        <MenuItemImageUpload 
          initialImageUrl={editingMenuItem?.image_url || null}
          onImageChange={handleImageChange}
          uploadingImage={uploadingImage}
        />
        
        <DietaryOptions form={form} />
        
        <FormActions 
          onCancel={onCancel}
          isEditing={!!editingMenuItem}
          isUploading={uploadingImage}
        />
      </form>
    </Form>
  );
};
