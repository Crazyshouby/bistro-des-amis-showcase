
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Save, Image as ImageIcon, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface HomepageImage {
  id: string;
  src: string;
  alt: string;
  section: string;
}

export const ImageSettings = () => {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const defaultImages = [
    { id: "hero", src: "/lovable-uploads/714769f0-6cd7-4831-bece-5bd87d46c6b1.png", alt: "Bistro interior", section: "Hero" },
    { id: "about", src: "/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png", alt: "Bistro exterior", section: "About" },
    { id: "gallery1", src: "/lovable-uploads/a801663d-ec08-448a-a543-cfeccd30346d.png", alt: "The bar", section: "Gallery" },
    { id: "gallery2", src: "/lovable-uploads/1cbe3f9b-808e-4c73-8fab-38ffe1369dde.png", alt: "Dining room", section: "Gallery" },
    { id: "gallery3", src: "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png", alt: "Interior space", section: "Gallery" },
    { id: "gallery4", src: "/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png", alt: "Barista", section: "Gallery" },
    { id: "gallery5", src: "/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png", alt: "Team member", section: "Gallery" },
    { id: "cta", src: "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png", alt: "CTA background", section: "CTA" }
  ];

  useEffect(() => {
    // In a real app, we would fetch the image data from the database
    // For now, we'll use the default images
    setImages(defaultImages);
    setLoading(false);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadImage(file, imageId);
    }
  };

  const uploadImage = async (file: File, imageId: string) => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage_${imageId}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const previewUrl = URL.createObjectURL(file);
      
      // In a real app, we would upload the file to Supabase storage
      // For now, we'll just update the state
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? { ...img, src: previewUrl } 
            : img
        )
      );
      
      toast({
        title: "Image mise à jour",
        description: "L'image a été mise à jour avec succès (simulation).",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'upload de l'image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateImageAlt = (id: string, newAlt: string) => {
    setImages(prevImages => 
      prevImages.map(img => 
        img.id === id 
          ? { ...img, alt: newAlt } 
          : img
      )
    );
  };

  if (loading) {
    return <div className="flex justify-center py-12">Chargement des images...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des images de la page d'accueil</h2>
        <Button onClick={() => toast({ title: "Modifications enregistrées", description: "Toutes les modifications ont été enregistrées (simulation)." })}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                Section {image.section} - {image.id}
              </CardTitle>
              <CardDescription>
                Modifiez l'image et sa description
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="relative aspect-video mb-3 bg-muted rounded-md overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor={`alt-${image.id}`}>Description de l'image</Label>
                  <Input 
                    id={`alt-${image.id}`} 
                    value={image.alt} 
                    onChange={(e) => updateImageAlt(image.id, e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Input
                  type="file"
                  id={`upload-${image.id}`}
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, image.id)}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById(`upload-${image.id}`)?.click()}
                  className="w-full"
                  disabled={uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Chargement..." : "Remplacer l'image"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-md flex items-start">
        <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Note: Dans cette version de démonstration, les modifications ne sont pas persistantes. 
          Dans une version de production, les images seraient stockées dans Supabase Storage.
        </p>
      </div>
    </div>
  );
};
