
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

export const ContactCustomization = () => {
  const { images, updateTheme } = useTheme();
  const [contactHeaderImage, setContactHeaderImage] = useState(images.contactHeaderImage || "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Synchroniser avec le ThemeProvider
    setContactHeaderImage(images.contactHeaderImage || "");
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
      const fileName = `contact_header_${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
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
        setContactHeaderImage(imageUrl);
        
        // Mise à jour dans le ThemeProvider et la base de données
        await updateTheme({ 
          images: { contactHeaderImage: imageUrl } 
        });
        
        toast({
          title: "Succès",
          description: "L'image d'en-tête a été mise à jour"
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation du Contact</CardTitle>
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
                {contactHeaderImage ? (
                  <img 
                    src={contactHeaderImage} 
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
                <Label htmlFor="contact-header-image" className="block mb-2">
                  Image d'en-tête de la page contact
                </Label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="relative" 
                    disabled={uploading}
                  >
                    <input
                      type="file"
                      id="contact-header-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Téléchargement..." : "Télécharger une image"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Pour de meilleurs résultats, utilisez une image au format paysage d'au moins 1920x400 pixels.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="pt-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Options de personnalisation pour le contenu de la page contact à venir...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
