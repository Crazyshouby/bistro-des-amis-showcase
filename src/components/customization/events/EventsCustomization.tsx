
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Upload, Check } from "lucide-react";

export const EventsCustomization = () => {
  const { images, updateTheme } = useTheme();
  const [eventsHeaderImage, setEventsHeaderImage] = useState(images.eventsHeaderImage || "");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    // Synchroniser avec le ThemeProvider
    setEventsHeaderImage(images.eventsHeaderImage || "");
    setTempImageUrl(images.eventsHeaderImage || "");
  }, [images]);

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
      const fileName = `events_header_${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
      const filePath = `header-images/${fileName}`;
      
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
        // On met à jour l'URL temporaire pour l'aperçu, sans sauvegarder encore
        setTempImageUrl(imageUrl);
        setChanged(true);
        
        toast({
          title: "Image téléchargée",
          description: "Cliquez sur Appliquer pour sauvegarder les changements"
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
      
      // Mise à jour dans le ThemeProvider et la base de données
      await updateTheme({ 
        images: { eventsHeaderImage: tempImageUrl } 
      });
      
      // Mise à jour de l'état local après sauvegarde
      setEventsHeaderImage(tempImageUrl);
      setChanged(false);
      
      toast({
        title: "Succès",
        description: "L'image d'en-tête a été appliquée et sauvegardée"
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
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation des Événements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="header" className="w-full">
          <TabsList>
            <TabsTrigger value="header">En-tête</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="header" className="pt-4">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                {tempImageUrl ? (
                  <img 
                    src={tempImageUrl} 
                    alt="Aperçu de l'en-tête" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <p className="text-gray-500">Aucune image</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="events-header-image" className="block mb-2">
                  Image d'en-tête de la page événements
                </Label>
                <div className="flex flex-wrap gap-4 mb-2">
                  <Button 
                    variant="outline" 
                    className="relative" 
                    disabled={uploading}
                  >
                    <input
                      type="file"
                      id="events-header-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Téléchargement..." : "Télécharger une image"}
                  </Button>
                  
                  <Button 
                    onClick={handleApplyChanges}
                    disabled={!changed || uploading}
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Appliquer
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Pour de meilleurs résultats, utilisez une image au format paysage d'au moins 1920x400 pixels.
                </p>
                {changed && (
                  <p className="text-sm text-amber-600 mt-2 font-bold">
                    N'oubliez pas de cliquer sur "Appliquer" pour sauvegarder vos modifications.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="pt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Options de personnalisation pour le contenu des événements à venir...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
