
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
import { X, Upload, Save, Image as ImageIcon, Info, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface HomepageImage {
  id: string;
  src: string;
  alt: string;
  section: string;
  imageFile?: File;
  isChanged?: boolean;
}

export const ImageSettings = () => {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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
    const loadImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('type', 'image')
          .order('id');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const loadedImages = data.map(item => ({
            id: item.key,
            src: item.value,
            alt: item.description || "",
            section: item.name
          }));
          
          setImages(loadedImages);
        } else {
          // If no images in database, save default ones
          setImages(defaultImages);
          saveDefaultImages();
        }
      } catch (error) {
        console.error('Error loading images:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les images depuis la base de données.",
          variant: "destructive"
        });
        setImages(defaultImages);
      } finally {
        setLoading(false);
      }
    };

    // Check if storage bucket exists and create if not
    const checkAndCreateBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        
        if (!buckets?.some(bucket => bucket.name === 'homepage-images')) {
          await supabase.storage.createBucket('homepage-images', {
            public: true
          });
        }
      } catch (error) {
        console.error('Error creating storage bucket:', error);
      }
    };

    checkAndCreateBucket();
    loadImages();
  }, []);

  const saveDefaultImages = async () => {
    try {
      // First, remove any existing image settings
      await supabase
        .from('site_settings')
        .delete()
        .eq('type', 'image');
      
      // Then insert the default images
      const imageData = defaultImages.map(image => ({
        type: 'image',
        key: image.id,
        name: image.section,
        value: image.src,
        description: image.alt
      }));
      
      const { error } = await supabase
        .from('site_settings')
        .insert(imageData);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error saving default images:', error);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, imageId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Update the state with preview first
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                imageFile: file,
                src: URL.createObjectURL(file),
                isChanged: true
              } 
            : img
        )
      );
    }
  };

  const uploadImage = async (imageId: string, file: File): Promise<string> => {
    try {
      setUploading(imageId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `homepage_${imageId}_${uuidv4()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('homepage-images')
        .upload(fileName, file, {
          upsert: true,
          cacheControl: '3600'
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('homepage-images')
        .getPublicUrl(fileName);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(null);
    }
  };

  const updateImageAlt = (id: string, newAlt: string) => {
    setImages(prevImages => 
      prevImages.map(img => 
        img.id === id 
          ? { ...img, alt: newAlt, isChanged: true } 
          : img
      )
    );
  };

  const saveAllChanges = async () => {
    setSaving(true);
    
    try {
      // First upload any changed image files
      const changedImages = images.filter(img => img.isChanged);
      
      for (const image of changedImages) {
        if (image.imageFile) {
          // Upload the new image file
          const publicUrl = await uploadImage(image.id, image.imageFile);
          
          // Update the image URL in state
          setImages(prevImages => 
            prevImages.map(img => 
              img.id === image.id 
                ? { ...img, src: publicUrl, imageFile: undefined } 
                : img
            )
          );
          
          // Wait a bit for state to update
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Now update all image records in the database
      await supabase
        .from('site_settings')
        .delete()
        .eq('type', 'image');
      
      const imageData = images.map(image => ({
        type: 'image',
        key: image.id,
        name: image.section,
        value: image.src,
        description: image.alt
      }));
      
      const { error } = await supabase
        .from('site_settings')
        .insert(imageData);
      
      if (error) throw error;
      
      // Reset isChanged flag
      setImages(prevImages => 
        prevImages.map(img => ({ ...img, isChanged: false }))
      );
      
      toast({
        title: "Images enregistrées",
        description: "Toutes les modifications ont été enregistrées avec succès."
      });
    } catch (error) {
      console.error('Error saving images:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement des images.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12">Chargement des images...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des images de la page d'accueil</h2>
        <Button 
          onClick={saveAllChanges} 
          disabled={saving || uploading !== null}
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
                  disabled={uploading !== null}
                >
                  {uploading === image.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploading === image.id ? "Chargement..." : "Remplacer l'image"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-md flex items-start">
        <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Toutes les modifications seront sauvegardées dans la base de données et les images 
          seront stockées dans Supabase Storage pour être accessibles sur tout le site.
        </p>
      </div>
    </div>
  );
};
