
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash, Upload, ImageIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export const HomeSection4 = () => {
  const { textContent, images, updateTheme, refreshTheme } = useTheme();
  const [sectionTitle, setSectionTitle] = useState(textContent?.galleryTitle || "Notre univers");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { id: "1", url: "/lovable-uploads/a801663d-ec08-448a-a543-cfeccd30346d.png", alt: "Le bar du Bistro des Amis" },
    { id: "2", url: "/lovable-uploads/1cbe3f9b-808e-4c73-8fab-38ffe1369dde.png", alt: "Salle à manger du Bistro des Amis" },
    { id: "3", url: "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png", alt: "Espace intérieur du Bistro des Amis" },
    { id: "4", url: "/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png", alt: "Notre barista préparant un café" },
    { id: "5", url: "/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png", alt: "Notre équipe passionnée" },
    { id: "6", url: "/lovable-uploads/bf89ee9a-96c9-4013-9f71-93f91dbff5d5.png", alt: "Façade du Bistro des Amis" }
  ]);
  const [titleColor, setTitleColor] = useState(textContent?.galleryTitleColor || "#3A2E1F");
  const [titleFont, setTitleFont] = useState(textContent?.galleryTitleFont || "Playfair Display");
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    // Load saved gallery images if available
    if (textContent?.galleryImages) {
      try {
        const savedGallery = JSON.parse(textContent.galleryImages);
        if (Array.isArray(savedGallery) && savedGallery.length > 0) {
          setGalleryImages(savedGallery);
        }
      } catch (e) {
        console.error("Erreur lors du chargement de la galerie:", e);
      }
    }
    
    setSectionTitle(textContent?.galleryTitle || "Notre univers");
    setTitleColor(textContent?.galleryTitleColor || "#3A2E1F");
    setTitleFont(textContent?.galleryTitleFont || "Playfair Display");
    setChanged(false); // Reset changed state when gallery is updated from ThemeProvider
  }, [textContent]);

  const handleAddImage = () => {
    setEditingImage({
      id: Date.now().toString(),
      url: "",
      alt: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setEditingImage(image);
    setIsDialogOpen(true);
  };

  const handleDeleteImage = (id: string) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
    setChanged(true);
  };

  const handleSaveImage = () => {
    if (!editingImage) return;
    
    if (!editingImage.url.trim()) {
      toast({
        title: "Erreur",
        description: "L'URL de l'image est requise",
        variant: "destructive"
      });
      return;
    }
    
    const isExisting = galleryImages.some(img => img.id === editingImage.id);
    
    if (isExisting) {
      setGalleryImages(galleryImages.map(img => 
        img.id === editingImage.id ? editingImage : img
      ));
    } else {
      setGalleryImages([...galleryImages, editingImage]);
    }
    
    setIsDialogOpen(false);
    setEditingImage(null);
    setChanged(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !editingImage) {
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
      const fileName = `gallery-image-${Date.now()}.${fileExt}`;
      const filePath = `site_images/${fileName}`;
      
      setUploading(true);
      
      console.log("Uploading gallery image:", filePath);
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site_images')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Gallery upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Gallery image uploaded successfully");
      
      // Get public URL
      const { data } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);
        
      if (data) {
        const imageUrl = data.publicUrl;
        console.log("Gallery image URL obtained:", imageUrl);
        
        setEditingImage({
          ...editingImage,
          url: imageUrl
        });
        
        toast({
          title: "Succès",
          description: "L'image a été téléchargée"
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

  const handleSaveGallery = async () => {
    try {
      console.log("Saving gallery with images:", galleryImages);
      setUploading(true);
      
      // Update theme with new gallery settings
      await updateTheme({
        textContent: {
          galleryTitle: sectionTitle,
          galleryImages: JSON.stringify(galleryImages),
          galleryTitleColor: titleColor,
          galleryTitleFont: titleFont
        }
      });
      
      // Explicitly refresh the theme to get the latest data
      await refreshTheme();
      
      setChanged(false);
      
      toast({
        title: "Succès",
        description: "La galerie a été mise à jour"
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la galerie:', error);
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
        <CardTitle>Galerie Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList>
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gallery-title">Titre de la section</Label>
                <Input 
                  id="gallery-title" 
                  value={sectionTitle}
                  onChange={(e) => {
                    setSectionTitle(e.target.value);
                    setChanged(true);
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Images de la galerie</h3>
                  <Button onClick={handleAddImage} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une image
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden bg-secondary/10">
                      <div className="aspect-[4/3] bg-gray-100 relative">
                        {image.url ? (
                          <img 
                            src={image.url} 
                            alt={image.alt} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium truncate">
                            {image.alt || "Sans légende"}
                          </span>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditImage(image)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteImage(image.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleSaveGallery}
                disabled={uploading || !changed}
              >
                {uploading ? "Enregistrement..." : "Enregistrer la galerie"}
              </Button>
              
              {changed && (
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mt-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    N'oubliez pas de cliquer sur "Enregistrer la galerie" pour sauvegarder vos changements.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title-font">Police du titre</Label>
                  <Select 
                    value={titleFont} 
                    onValueChange={(value) => {
                      setTitleFont(value);
                      setChanged(true);
                    }}
                  >
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
                        onChange={(e) => {
                          setTitleColor(e.target.value);
                          setChanged(true);
                        }}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={titleColor}
                      onChange={(e) => {
                        setTitleColor(e.target.value);
                        setChanged(true);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSaveGallery}
                disabled={uploading || !changed}
              >
                {uploading ? "Enregistrement..." : "Enregistrer les styles"}
              </Button>
              
              {changed && (
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mt-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    N'oubliez pas de cliquer sur "Enregistrer les styles" pour sauvegarder vos changements.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingImage && galleryImages.some(img => img.id === editingImage.id) 
                  ? "Modifier l'image" 
                  : "Ajouter une image"
                }
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative mb-4">
                {editingImage?.url ? (
                  <img 
                    src={editingImage.url} 
                    alt={editingImage.alt} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-upload">Image</Label>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    className="relative"
                    disabled={uploading}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Téléchargement..." : "Télécharger une image"}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-url">URL de l'image</Label>
                <Input 
                  id="image-url" 
                  value={editingImage?.url || ""}
                  onChange={(e) => setEditingImage(prev => 
                    prev ? { ...prev, url: e.target.value } : null
                  )}
                  placeholder="https://exemple.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Vous pouvez utiliser une URL existante ou télécharger une nouvelle image
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-alt">Légende / Texte alternatif</Label>
                <Input 
                  id="image-alt" 
                  value={editingImage?.alt || ""}
                  onChange={(e) => setEditingImage(prev => 
                    prev ? { ...prev, alt: e.target.value } : null
                  )}
                  placeholder="Description de l'image"
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleSaveImage}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
