
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const HomeSection1 = () => {
  const { colors, images, textContent, updateTheme, refreshTheme } = useTheme();
  const [backgroundImage, setBackgroundImage] = useState(images.homeImageUrl || "");
  const [heroTitle, setHeroTitle] = useState(textContent?.heroTitle || "Bienvenue au Bistro des Amis");
  const [heroSubtitle, setHeroSubtitle] = useState(textContent?.heroSubtitle || "Votre pause gourmande à Verdun");
  const [heroTitleFont, setHeroTitleFont] = useState(textContent?.heroTitleFont || "Playfair Display");
  const [heroTitleColor, setHeroTitleColor] = useState(textContent?.heroTitleColor || "#F5E9D7");
  const [heroSubtitleColor, setHeroSubtitleColor] = useState(textContent?.heroSubtitleColor || "#F5E9D7");
  const [uploading, setUploading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [fontOptions] = useState([
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Lato", label: "Lato" },
  ]);

  useEffect(() => {
    setBackgroundImage(images.homeImageUrl || "");
    setHeroTitle(textContent?.heroTitle || "Bienvenue au Bistro des Amis");
    setHeroSubtitle(textContent?.heroSubtitle || "Votre pause gourmande à Verdun");
    setHeroTitleFont(textContent?.heroTitleFont || "Playfair Display");
    setHeroTitleColor(textContent?.heroTitleColor || "#F5E9D7");
    setHeroSubtitleColor(textContent?.heroSubtitleColor || "#F5E9D7");
    setChanged(false); // Reset changed state when hero is updated from ThemeProvider
  }, [images, textContent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
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
      
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-image-${Date.now()}.${fileExt}`;
      const filePath = `site_images/${fileName}`;
      
      setUploading(true);
      
      console.log("Uploading hero image:", filePath);
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Hero upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Hero image uploaded successfully");
      
      // Get public URL
      const { data } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);
        
      if (data) {
        const imageUrl = data.publicUrl;
        console.log("Hero image URL obtained:", imageUrl);
        
        // Update local state
        setBackgroundImage(imageUrl);
        setChanged(true);
        
        toast({
          title: "Succès",
          description: "L'image d'arrière-plan a été téléchargée. Cliquez sur Appliquer pour sauvegarder."
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

  const handleApplyImage = async () => {
    if (!backgroundImage) {
      toast({
        title: "Erreur",
        description: "Aucune image à appliquer",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setUploading(true);
      console.log("Applying hero image URL:", backgroundImage);
      
      // Update theme with the new hero image URL
      await updateTheme({ 
        images: { homeImageUrl: backgroundImage } 
      });
      
      // Explicitly refresh the theme to get the latest data
      await refreshTheme();
      
      setChanged(false);
      
      toast({
        title: "Succès",
        description: "L'image d'arrière-plan a été appliquée"
      });
    } catch (error) {
      console.error('Erreur lors de l\'application de l\'image:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer l'image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveTexts = async () => {
    try {
      setUploading(true);
      console.log("Saving hero texts");
      
      await updateTheme({
        textContent: {
          heroTitle,
          heroSubtitle,
          heroTitleFont,
          heroTitleColor,
          heroSubtitleColor
        }
      });
      
      // Explicitly refresh the theme to get the latest data
      await refreshTheme();
      
      setChanged(false);
      
      toast({
        title: "Succès",
        description: "Les textes ont été mis à jour"
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des textes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les textes",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTextChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setChanged(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Hero - Bannière d'accueil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="image" className="w-full">
          <TabsList>
            <TabsTrigger value="image">Image d'arrière-plan</TabsTrigger>
            <TabsTrigger value="texts">Textes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="pt-4">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                {backgroundImage ? (
                  <img 
                    src={backgroundImage} 
                    alt="Aperçu de l'arrière-plan" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <p className="text-gray-500">Aucune image</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="background-image" className="block mb-2">
                  Changer l'image d'arrière-plan
                </Label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="relative" 
                    disabled={uploading}
                  >
                    <input
                      type="file"
                      id="background-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Téléchargement..." : "Télécharger une image"}
                  </Button>
                  
                  {changed && (
                    <Button 
                      onClick={handleApplyImage} 
                      disabled={uploading || !changed}
                    >
                      {uploading ? "Application..." : "Appliquer l'image"}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Pour de meilleurs résultats, utilisez une image au format paysage d'au moins 1920x1080 pixels.
                </p>
                
                {changed && (
                  <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mt-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      N'oubliez pas de cliquer sur "Appliquer l'image" pour sauvegarder vos changements.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="texts" className="pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Titre principal</Label>
                <Textarea 
                  id="hero-title" 
                  value={heroTitle}
                  onChange={handleTextChange(setHeroTitle)}
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Sous-titre</Label>
                <Textarea 
                  id="hero-subtitle" 
                  value={heroSubtitle}
                  onChange={handleTextChange(setHeroSubtitle)}
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title-font">Police du titre</Label>
                  <Select 
                    value={heroTitleFont} 
                    onValueChange={(value) => {
                      setHeroTitleFont(value);
                      setChanged(true);
                    }}
                  >
                    <SelectTrigger id="hero-title-font">
                      <SelectValue placeholder="Choisir une police" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-title-color">Couleur du titre</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="hero-title-color"
                        value={heroTitleColor}
                        onChange={(e) => {
                          setHeroTitleColor(e.target.value);
                          setChanged(true);
                        }}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={heroTitleColor}
                      onChange={handleTextChange(setHeroTitleColor)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle-color">Couleur du sous-titre</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="hero-subtitle-color"
                        value={heroSubtitleColor}
                        onChange={(e) => {
                          setHeroSubtitleColor(e.target.value);
                          setChanged(true);
                        }}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={heroSubtitleColor}
                      onChange={handleTextChange(setHeroSubtitleColor)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSaveTexts}
                disabled={uploading || !changed}
              >
                {uploading ? "Enregistrement..." : "Enregistrer les textes"}
              </Button>
              
              {changed && (
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mt-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    N'oubliez pas de cliquer sur "Enregistrer les textes" pour sauvegarder vos changements.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
