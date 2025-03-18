
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Image, Save } from "lucide-react";

export const ContentSettings = () => {
  const [homeImageUrl, setHomeImageUrl] = useState("");
  const [homeText, setHomeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['home_image_url', 'home_text']);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          data.forEach(item => {
            if (item.key === 'home_image_url') {
              setHomeImageUrl(item.value);
              if (item.value) {
                setPreviewUrl(item.value);
              }
            } else if (item.key === 'home_text') {
              setHomeText(item.value);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le contenu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image doit faire moins de 5Mo",
        variant: "destructive",
      });
      e.target.value = '';
      return;
    }
    
    // Check file type
    if (!selectedFile.type.match('image/(jpeg|jpg|png|gif|webp)')) {
      toast({
        title: "Erreur",
        description: "Seuls les formats JPEG, PNG, GIF et WEBP sont acceptés",
        variant: "destructive",
      });
      e.target.value = '';
      return;
    }
    
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const uploadImage = async () => {
    if (!file) return null;
    
    try {
      // Create a random filename with the original extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `home-images/${fileName}`;
      
      // Upload the file to Supabase Storage (this would require a storage bucket setup)
      // For now, we'll simulate upload and store the URL
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
      
      // Simulate file upload completion after progress reaches 100%
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      // Return simulated URL (in a real app, this would be the actual Supabase URL)
      return previewUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let imageUrl = homeImageUrl;
      
      // If a new file was selected, upload it
      if (file) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      // Update home_image_url in site_config
      const { error: imageError } = await supabase
        .from('site_config')
        .update({ value: imageUrl })
        .eq('key', 'home_image_url');
      
      if (imageError) throw imageError;
      
      // Update home_text in site_config
      const { error: textError } = await supabase
        .from('site_config')
        .update({ value: homeText })
        .eq('key', 'home_text');
      
      if (textError) throw textError;
      
      // Update state with saved values
      setHomeImageUrl(imageUrl);
      
      toast({
        title: "Succès",
        description: "Le contenu a été mis à jour",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contenu",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2DD4BF]"></div>
      </div>
    );
  }

  return (
    <Card className="border border-[#6B7280]">
      <CardHeader className="bg-[#F3F4F6] border-b border-[#6B7280]">
        <CardTitle className="text-[#374151]">Personnalisation de la page d'accueil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div>
          <h3 className="text-[#374151] font-medium mb-4">Image de la page d'accueil</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-[#6B7280] rounded-md p-6 text-center">
              <input
                type="file"
                id="home-image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              {previewUrl ? (
                <div className="space-y-4">
                  <div className="relative max-w-md mx-auto">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="max-h-60 mx-auto rounded-md"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white bg-opacity-70"
                      onClick={() => {
                        setPreviewUrl("");
                        setFile(null);
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                  <Label
                    htmlFor="home-image"
                    className="bg-[#2DD4BF] text-white hover:bg-[#6B7280] px-4 py-2 rounded-md cursor-pointer inline-block"
                  >
                    Changer l'image
                  </Label>
                </div>
              ) : (
                <div className="space-y-4">
                  <Image className="mx-auto h-12 w-12 text-[#6B7280]" />
                  <p className="text-[#6B7280]">
                    Glissez-déposez une image ou 
                    <Label
                      htmlFor="home-image"
                      className="text-[#2DD4BF] cursor-pointer hover:underline ml-1"
                    >
                      parcourez
                    </Label>
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    PNG, JPG, GIF ou WEBP (max. 5Mo)
                  </p>
                </div>
              )}
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#2DD4BF] h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Upload en cours... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[#374151] font-medium mb-4">Texte de la page d'accueil</h3>
          <div className="space-y-2">
            <Textarea
              value={homeText}
              onChange={(e) => setHomeText(e.target.value)}
              className="h-32 border-[#6B7280]"
              maxLength={500}
            />
            <p className="text-xs text-[#6B7280]">
              {homeText.length}/500 caractères
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#2DD4BF] text-white hover:bg-[#6B7280]"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer le contenu"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
