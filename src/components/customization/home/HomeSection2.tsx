
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

export const HomeSection2 = () => {
  const { images, textContent, updateTheme } = useTheme();
  const [historyImage, setHistoryImage] = useState(images.historyImageUrl || "/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png");
  const [historyTitle, setHistoryTitle] = useState(textContent?.historyTitle || "Notre Histoire");
  const [historyText, setHistoryText] = useState(
    textContent?.historyText || 
    "Un bistro rustique au cœur de Verdun, où bonne cuisine et ambiance conviviale se rencontrent. Ouvert depuis 1930, le Bistro des Amis perpétue la tradition d'une cuisine authentique dans un cadre chaleureux."
  );
  const [historyText2, setHistoryText2] = useState(
    textContent?.historyText2 || 
    "Notre philosophie est simple : des produits frais, des plats savoureux et un service attentionné. Que ce soit pour un déjeuner rapide, un dîner en famille ou un souper entre amis, notre équipe vous accueille avec le sourire."
  );
  const [titleColor, setTitleColor] = useState(textContent?.historyTitleColor || "#3A2E1F");
  const [textColor, setTextColor] = useState(textContent?.historyTextColor || "#3A2E1F");
  const [titleFont, setTitleFont] = useState(textContent?.historyTitleFont || "Playfair Display");
  const [uploading, setUploading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [fontOptions] = useState([
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Lato", label: "Lato" },
  ]);

  useEffect(() => {
    setHistoryImage(images.historyImageUrl || "/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png");
    setHistoryTitle(textContent?.historyTitle || "Notre Histoire");
    setHistoryText(textContent?.historyText || "Un bistro rustique au cœur de Verdun...");
    setHistoryText2(textContent?.historyText2 || "Notre philosophie est simple...");
    setTitleColor(textContent?.historyTitleColor || "#3A2E1F");
    setTextColor(textContent?.historyTextColor || "#3A2E1F");
    setTitleFont(textContent?.historyTitleFont || "Playfair Display");
    setImageChanged(false);
  }, [images, textContent]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `history-image-${Date.now()}.${fileExt}`;
      const filePath = `site_images/${fileName}`;
      
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);
        
      if (data) {
        const imageUrl = data.publicUrl;
        setHistoryImage(imageUrl);
        setImageChanged(true);
        
        toast({
          title: "Image téléchargée",
          description: "N'oubliez pas de cliquer sur 'Enregistrer les modifications' pour appliquer le changement"
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
    try {
      await updateTheme({ 
        images: { historyImageUrl: historyImage } 
      });
      
      setImageChanged(false);
      
      toast({
        title: "Succès",
        description: "L'image de la section histoire a été mise à jour"
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'image",
        variant: "destructive"
      });
    }
  };

  const handleSaveTexts = () => {
    updateTheme({
      textContent: {
        historyTitle,
        historyText,
        historyText2,
        historyTitleColor: titleColor,
        historyTextColor: textColor,
        historyTitleFont: titleFont
      }
    });
    
    toast({
      title: "Succès",
      description: "Les textes de la section histoire ont été mis à jour"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Histoire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="image" className="w-full">
          <TabsList>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="texts">Textes</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="image" className="pt-4">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                {historyImage ? (
                  <img 
                    src={historyImage} 
                    alt="Aperçu de l'image histoire" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <p className="text-gray-500">Aucune image</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="history-image" className="block mb-2">
                  Changer l'image de la section histoire
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
                  
                  {imageChanged && (
                    <Button 
                      onClick={handleApplyImage}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Appliquer l'image
                    </Button>
                  )}
                </div>
                
                {imageChanged && (
                  <p className="text-sm text-red-500 font-semibold mt-2">
                    ⚠️ N'oubliez pas de cliquer sur "Appliquer l'image" pour sauvegarder votre changement!
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground mt-2">
                  Utilisez une image illustrant l'histoire ou l'ambiance de votre établissement.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="texts" className="pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="history-title">Titre de la section</Label>
                <Input 
                  id="history-title" 
                  value={historyTitle}
                  onChange={(e) => setHistoryTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="history-text">Premier paragraphe</Label>
                <Textarea 
                  id="history-text" 
                  value={historyText}
                  onChange={(e) => setHistoryText(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="history-text-2">Deuxième paragraphe</Label>
                <Textarea 
                  id="history-text-2" 
                  value={historyText2}
                  onChange={(e) => setHistoryText2(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
              
              <Button onClick={handleSaveTexts} className="bg-green-600 hover:bg-green-700 text-white">
                Enregistrer les textes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title-font">Police du titre</Label>
                  <Select value={titleFont} onValueChange={setTitleFont}>
                    <SelectTrigger id="title-font">
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
                  <Label htmlFor="title-color">Couleur du titre</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="title-color"
                        value={titleColor}
                        onChange={(e) => setTitleColor(e.target.value)}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="text-color">Couleur du texte</Label>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded border">
                    <input
                      type="color"
                      id="text-color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-full cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <Input 
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveTexts} className="bg-green-600 hover:bg-green-700 text-white">
                Enregistrer les styles
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
