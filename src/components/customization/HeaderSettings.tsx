import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Image, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PageType = "menu" | "events" | "contact";

interface HeaderImage {
  pageType: PageType;
  imageUrl: string;
  file: File | null;
  previewUrl: string;
  uploadProgress: number;
}

export const HeaderSettings = () => {
  const [headerImages, setHeaderImages] = useState<{ [key in PageType]: HeaderImage }>({
    menu: { pageType: "menu", imageUrl: "", file: null, previewUrl: "", uploadProgress: 0 },
    events: { pageType: "events", imageUrl: "", file: null, previewUrl: "", uploadProgress: 0 },
    contact: { pageType: "contact", imageUrl: "", file: null, previewUrl: "", uploadProgress: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHeaderImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['menu_header_image', 'events_header_image', 'contact_header_image']);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const newHeaderImages = { ...headerImages };
          
          data.forEach(item => {
            if (item.key === 'menu_header_image') {
              newHeaderImages.menu.imageUrl = item.value;
              newHeaderImages.menu.previewUrl = item.value;
            } else if (item.key === 'events_header_image') {
              newHeaderImages.events.imageUrl = item.value;
              newHeaderImages.events.previewUrl = item.value;
            } else if (item.key === 'contact_header_image') {
              newHeaderImages.contact.imageUrl = item.value;
              newHeaderImages.contact.previewUrl = item.value;
            }
          });
          
          setHeaderImages(newHeaderImages);
        }
      } catch (error) {
        console.error('Error fetching header images:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les images d'en-tête",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderImages();
  }, []);

  const handleFileChange = (pageType: PageType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 5Mo",
        variant: "destructive"
      });
      e.target.value = '';
      return;
    }

    // Check file type
    if (!selectedFile.type.match('image/(jpeg|jpg|png|gif|webp)')) {
      toast({
        title: "Erreur",
        description: "Seuls les formats JPEG, PNG, GIF et WEBP sont acceptés",
        variant: "destructive"
      });
      e.target.value = '';
      return;
    }

    setHeaderImages(prev => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        file: selectedFile,
        previewUrl: URL.createObjectURL(selectedFile)
      }
    }));
  };

  const uploadImage = async (pageType: PageType) => {
    const headerImage = headerImages[pageType];
    if (!headerImage.file) return null;

    try {
      // Create a random filename with the original extension
      const fileExt = headerImage.file.name.split('.').pop();
      const fileName = `${pageType}_header_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `header-images/${fileName}`;

      // Start simulating progress before actual upload
      const progressInterval = setInterval(() => {
        setHeaderImages(prev => ({
          ...prev,
          [pageType]: {
            ...prev[pageType],
            uploadProgress: prev[pageType].uploadProgress >= 90 
              ? 90 
              : prev[pageType].uploadProgress + 10
          }
        }));
      }, 200);

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('site_images')
        .upload(filePath, headerImage.file, {
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);
      
      if (error) {
        throw error;
      }

      // Set progress to 100% when upload completes
      setHeaderImages(prev => ({
        ...prev,
        [pageType]: {
          ...prev[pageType],
          uploadProgress: 100
        }
      }));

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('site_images')
        .getPublicUrl(filePath);

      // Reset progress after a short delay
      setTimeout(() => {
        setHeaderImages(prev => ({
          ...prev,
          [pageType]: {
            ...prev[pageType],
            uploadProgress: 0
          }
        }));
      }, 500);
      
      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${pageType} header image:`, error);
      toast({
        title: "Erreur",
        description: `Impossible d'uploader l'image pour ${getPageLabel(pageType)}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setTimeout(() => {
        setHeaderImages(prev => ({
          ...prev,
          [pageType]: {
            ...prev[pageType],
            uploadProgress: 0
          }
        }));
      }, 500);
    }
  };

  const handleSave = async (pageType: PageType) => {
    setSaving(true);
    try {
      let imageUrl = headerImages[pageType].imageUrl;

      // If a new file was selected, upload it
      if (headerImages[pageType].file) {
        const uploadedUrl = await uploadImage(pageType);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Determine the key in the database based on page type
      const dbKey = `${pageType}_header_image`;

      // Check if the record exists
      const { data: existingData, error: checkError } = await supabase
        .from('site_config')
        .select('id')
        .eq('key', dbKey);

      if (checkError) {
        throw checkError;
      }

      // Update or insert the record
      if (existingData && existingData.length > 0) {
        const { error: updateError } = await supabase
          .from('site_config')
          .update({ value: imageUrl })
          .eq('key', dbKey);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_config')
          .insert([{ key: dbKey, value: imageUrl }]);
        
        if (insertError) throw insertError;
      }

      // Update state with saved values
      setHeaderImages(prev => ({
        ...prev,
        [pageType]: {
          ...prev[pageType],
          imageUrl
        }
      }));

      toast({
        title: "Succès",
        description: `L'image d'en-tête pour ${getPageLabel(pageType)} a été mise à jour`
      });
    } catch (error) {
      console.error(`Error saving ${pageType} header image:`, error);
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder l'image pour ${getPageLabel(pageType)}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getPageLabel = (pageType: PageType): string => {
    switch (pageType) {
      case "menu": return "Menu";
      case "events": return "Événements";
      case "contact": return "Contact";
      default: return pageType;
    }
  };

  const renderImageUploader = (pageType: PageType) => {
    const { previewUrl, uploadProgress } = headerImages[pageType];
    
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed border-neutral-300 rounded-md p-6 text-center">
          <input 
            type="file" 
            id={`${pageType}-header-image`} 
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange(pageType)}
            className="hidden" 
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative max-w-md mx-auto">
                <img 
                  src={previewUrl} 
                  alt={`En-tête ${getPageLabel(pageType)}`} 
                  className="max-h-60 mx-auto rounded-md" 
                />
                <Button
                  type="button"
                  variant="outline"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white bg-opacity-70"
                  onClick={() => {
                    setHeaderImages(prev => ({
                      ...prev,
                      [pageType]: {
                        ...prev[pageType],
                        previewUrl: prev[pageType].imageUrl,
                        file: null
                      }
                    }));
                  }}
                >
                  ✕
                </Button>
              </div>
              <Label 
                htmlFor={`${pageType}-header-image`}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md cursor-pointer inline-block"
              >
                Changer l'image
              </Label>
            </div>
          ) : (
            <div className="space-y-4">
              <Image className="mx-auto h-12 w-12 text-neutral-400" />
              <p className="text-neutral-500">
                Glissez-déposez une image ou 
                <Label 
                  htmlFor={`${pageType}-header-image`} 
                  className="text-primary cursor-pointer hover:underline ml-1"
                >
                  parcourez
                </Label>
              </p>
              <p className="text-xs text-neutral-500">
                PNG, JPG, GIF ou WEBP (max. 5Mo)
              </p>
            </div>
          )}
        </div>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="bg-neutral-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Upload en cours... {uploadProgress}%
            </p>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={() => handleSave(pageType)} 
            disabled={saving || !headerImages[pageType].file}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer l'image"}
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Personnalisation des en-têtes de pages</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="menu">
          <TabsList className="mb-6">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <h3 className="font-medium mb-4">Image d'en-tête pour la page Menu</h3>
            {renderImageUploader("menu")}
          </TabsContent>
          
          <TabsContent value="events">
            <h3 className="font-medium mb-4">Image d'en-tête pour la page Événements</h3>
            {renderImageUploader("events")}
          </TabsContent>
          
          <TabsContent value="contact">
            <h3 className="font-medium mb-4">Image d'en-tête pour la page Contact</h3>
            {renderImageUploader("contact")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
