
import { useState } from "react";
import { InPlaceTextEditor } from "../InPlaceTextEditor";
import { InPlaceImageEditor } from "../InPlaceImageEditor";
import { useInPlaceEditing } from "../InPlaceEditingProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export const EditableHomeContent = () => {
  const { isEditingEnabled } = useInPlaceEditing();
  const { textContent, images, updateTheme } = useTheme();
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveHeroTitle = async (values: {
    text: string;
    color?: string;
    font?: string;
  }) => {
    try {
      setIsSaving(true);
      
      await updateTheme({
        textContent: {
          heroTitle: values.text,
          heroTitleColor: values.color,
          heroTitleFont: values.font
        }
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving hero title:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le titre",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveHeroSubtitle = async (values: {
    text: string;
    color?: string;
    font?: string;
  }) => {
    try {
      setIsSaving(true);
      
      await updateTheme({
        textContent: {
          heroSubtitle: values.text,
          heroSubtitleColor: values.color
        }
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving hero subtitle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le sous-titre",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveHeroImage = async (newImageUrl: string) => {
    try {
      setIsSaving(true);
      
      await updateTheme({
        images: {
          homeImageUrl: newImageUrl
        }
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error saving hero image:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'image",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isEditingEnabled) {
    return null;
  }
  
  return (
    <Card className="border-2 border-primary border-dashed">
      <CardHeader>
        <CardTitle>Édition directe de la section Hero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Titre principal</h3>
          <InPlaceTextEditor
            initialText={textContent?.heroTitle || "Bienvenue au Bistro des Amis"}
            initialColor={textContent?.heroTitleColor || "#F5E9D7"}
            initialFont={textContent?.heroTitleFont || "Playfair Display"}
            onSave={handleSaveHeroTitle}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sous-titre</h3>
          <InPlaceTextEditor
            initialText={textContent?.heroSubtitle || "Votre pause gourmande à Verdun"}
            initialColor={textContent?.heroSubtitleColor || "#F5E9D7"}
            onSave={handleSaveHeroSubtitle}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Image d'arrière-plan</h3>
          <InPlaceImageEditor
            imageUrl={images.homeImageUrl || "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png"}
            alt="Image d'arrière-plan"
            onSave={handleSaveHeroImage}
            className="max-w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
