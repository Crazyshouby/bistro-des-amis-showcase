
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Save, AlertTriangle } from "lucide-react";

export const HistoryImageUploader = () => {
  const { images, updateTheme } = useTheme();
  const [historyImage, setHistoryImage] = useState(images.historyImageUrl || "");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHistoryImage(images.historyImageUrl || "");
    setTempImageUrl(images.historyImageUrl || "");
  }, [images.historyImageUrl]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      
      // Vérification du type et de la taille
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
      
      setUploading(true);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `history_image_${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = `site-images/${fileName}`;
      
      // Upload de l'image vers Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Récupérer l'URL publique
      const { data } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);
        
      if (data) {
        const imageUrl = data.publicUrl;
        setTempImageUrl(imageUrl);
        setHasChanges(true);
        
        toast({
          title: "Image téléchargée",
          description: "Cliquez sur Appliquer pour sauvegarder les changements",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleApplyChanges = async () => {
    try {
      setUploading(true);
      
      console.log("Applying history image change:", tempImageUrl);
      
      // Mise à jour dans le ThemeProvider et la base de données
      await updateTheme({ 
        images: { historyImageUrl: tempImageUrl } 
      });
      
      // Mise à jour de l'état local après sauvegarde
      setHistoryImage(tempImageUrl);
      setHasChanges(false);
      
      toast({
        title: "Succès",
        description: "L'image d'histoire a été appliquée et sauvegardée"
      });
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur", 
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
        {tempImageUrl ? (
          <img 
            src={tempImageUrl} 
            alt="Aperçu de l'image d'histoire" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <p className="text-gray-500">Aucune image</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="history-image" className="block font-medium">
          Image de la section "Notre Histoire"
        </Label>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="relative" 
            disabled={uploading}
          >
            <input
              type="file"
              id="history-image"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Téléchargement..." : "Télécharger une image"}
          </Button>
          
          {hasChanges && (
            <Button 
              onClick={handleApplyChanges}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Appliquer
            </Button>
          )}
        </div>
        
        {hasChanges && (
          <div className="flex items-start mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <strong>N'oubliez pas de cliquer sur "Appliquer"</strong> pour enregistrer définitivement l'image.
            </p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mt-2">
          Pour de meilleurs résultats, utilisez une image au format paysage d'au moins 1200x800 pixels.
        </p>
      </div>
    </div>
  );
};
