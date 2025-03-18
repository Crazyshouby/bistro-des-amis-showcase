
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InPlaceImageEditorProps {
  imageUrl: string;
  alt: string;
  onSave: (newImageUrl: string) => Promise<void>;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "portrait";
}

export const InPlaceImageEditor = ({
  imageUrl,
  alt,
  onSave,
  className = "",
  aspectRatio = "video"
}: InPlaceImageEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    portrait: "aspect-[3/4]"
  };
  
  const handleImageClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Size and type validation
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image doit faire moins de 5Mo",
          variant: "destructive"
        });
        return;
      }
      
      if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
        toast({
          title: "Erreur",
          description: "Seuls les formats JPEG, PNG, GIF et WEBP sont acceptés",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(null);
    setSelectedFile(null);
  };
  
  const handleSave = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Aucune image sélectionnée",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `image-${Date.now()}.${fileExt}`;
      const filePath = `site_images/${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(filePath, selectedFile);
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);
        
      if (data) {
        const newImageUrl = data.publicUrl;
        console.log("New image URL:", newImageUrl);
        
        await onSave(newImageUrl);
        
        toast({
          title: "Succès",
          description: "L'image a été mise à jour avec succès."
        });
        
        setIsEditing(false);
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div 
      className={`group relative ${className} ${aspectRatioClasses[aspectRatio]}`}
    >
      {isEditing ? (
        <div className="w-full h-full flex flex-col">
          <div className={`${aspectRatioClasses[aspectRatio]} bg-gray-100 rounded overflow-hidden mb-2`}>
            <img 
              src={previewUrl || imageUrl} 
              alt={alt} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="relative"
              disabled={isUploading}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Téléchargement..." : "Choisir une image"}
            </Button>
            
            <div className="flex gap-2 justify-end mt-2">
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={isUploading}>
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={isUploading || !selectedFile}
              >
                <Check className="h-4 w-4 mr-1" />
                {isUploading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          onClick={handleImageClick}
          className="cursor-pointer w-full h-full relative"
        >
          <img 
            src={imageUrl} 
            alt={alt} 
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute inset-0 border border-dashed border-transparent group-hover:border-gray-300 rounded pointer-events-none"></div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center transition-opacity">
            <div className="bg-white bg-opacity-0 group-hover:bg-opacity-80 p-2 rounded-full scale-0 group-hover:scale-100 transition-transform">
              <Upload className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
