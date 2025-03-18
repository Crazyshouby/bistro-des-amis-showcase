
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MenuItemImageUploadProps {
  initialImageUrl?: string | null;
  onImageChange: (imageFile: File | null, imagePreview: string | null) => void;
  uploadingImage: boolean;
  setUploadProgress?: (progress: number) => void;
  uploadProgress?: number;
}

export const MenuItemImageUpload = ({ 
  initialImageUrl, 
  onImageChange,
  uploadingImage,
  setUploadProgress,
  uploadProgress = 0
}: MenuItemImageUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      onImageChange(file, previewUrl);
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    onImageChange(null, null);
  };

  return (
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
        
        <div className="flex-1">
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
          
          {uploadingImage && (
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress < 100 ? "Téléchargement en cours..." : "Téléchargement terminé"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const uploadImage = async (file: File, setProgress?: (progress: number) => void): Promise<string | null> => {
  try {
    // Simuler la progression de l'upload
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress >= 90) {
        clearInterval(progressInterval);
      }
      if (setProgress) setProgress(progress);
    }, 200);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `menu_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('site_images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    clearInterval(progressInterval);
    
    if (error) throw error;
    
    // Set progress to 100%
    if (setProgress) setProgress(100);
    
    const { data: { publicUrl } } = supabase.storage
      .from('site_images')
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
  }
};
