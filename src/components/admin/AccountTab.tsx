
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Edit, User, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const profileSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

interface AccountTabProps {
  user: any;
}

export const AccountTab = ({ user }: AccountTabProps) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<z.infer<typeof profileSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      facebookUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      youtubeUrl: "",
    }
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Get user data from auth
          const initialData = {
            fullName: user?.user_metadata?.full_name || "",
            phone: user?.user_metadata?.phone || "",
            email: user?.email || "",
            address: user?.user_metadata?.address || "",
            facebookUrl: user?.user_metadata?.facebook_url || "",
            instagramUrl: user?.user_metadata?.instagram_url || "",
            twitterUrl: user?.user_metadata?.twitter_url || "",
            youtubeUrl: user?.user_metadata?.youtube_url || "",
          };
          
          // Try to get additional data from profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!error && data) {
            // Merge data from profiles table
            const mergedData = {
              ...initialData,
              fullName: data.full_name || initialData.fullName,
              facebookUrl: data.facebook_url || initialData.facebookUrl,
              instagramUrl: data.instagram_url || initialData.instagramUrl,
              twitterUrl: data.twitter_url || initialData.twitterUrl,
              youtubeUrl: data.youtube_url || initialData.youtubeUrl,
            };
            
            setProfileData(mergedData);
            form.reset(mergedData);
          } else {
            setProfileData(initialData);
            form.reset(initialData);
          }
          
          // Determine if we should start in edit mode (no data entered yet)
          const hasData = 
            initialData.fullName || 
            initialData.phone || 
            initialData.address || 
            initialData.facebookUrl || 
            initialData.instagramUrl || 
            initialData.twitterUrl || 
            initialData.youtubeUrl;
          
          setEditMode(!hasData);
        } catch (error) {
          console.error('Error loading profile:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les données du profil",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserProfile();
  }, [user, form]);

  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      // Update Supabase auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.fullName,
          phone: data.phone,
          address: data.address,
          facebook_url: data.facebookUrl,
          instagram_url: data.instagramUrl,
          twitter_url: data.twitterUrl,
          youtube_url: data.youtubeUrl,
        }
      });

      if (authError) throw authError;

      // Update profiles table with social media URLs
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: data.fullName,
            facebook_url: data.facebookUrl,
            instagram_url: data.instagramUrl,
            twitter_url: data.twitterUrl,
            youtube_url: data.youtubeUrl,
          })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      setProfileData(data);
      setEditMode(false);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du profil.",
        variant: "destructive",
      });
    }
  };

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 mt-0.5 text-bistro-wood">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-base">{value || "Non renseigné"}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Informations du Compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center min-h-[300px]">
            <p>Chargement des données...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-playfair text-bistro-wood">Informations du Compte</CardTitle>
        {!editMode && (
          <Button 
            onClick={() => setEditMode(true)} 
            className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {editMode ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Nom Complet</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nom complet" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Numéro de Téléphone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Numéro de téléphone" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Adresse Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Adresse</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Adresse complète" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="border-t border-bistro-sand pt-6 mt-6">
                <h3 className="text-lg font-playfair font-semibold mb-4 text-bistro-wood">Réseaux Sociaux</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">Facebook</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://facebook.com/votreprofil" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">Instagram</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://instagram.com/votreprofil" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">X (Twitter)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://x.com/votreprofil" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-bistro-wood">YouTube</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://youtube.com/c/votrechaine" 
                            {...field} 
                            className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="bg-bistro-olive hover:bg-bistro-olive-light text-white mt-4"
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <InfoItem 
                icon={<User className="h-5 w-5" />} 
                label="Nom Complet" 
                value={profileData?.fullName || ""}
              />
              
              <InfoItem 
                icon={<Phone className="h-5 w-5" />} 
                label="Numéro de Téléphone" 
                value={profileData?.phone || ""}
              />
              
              <InfoItem 
                icon={<Mail className="h-5 w-5" />} 
                label="Adresse Email" 
                value={profileData?.email || ""}
              />
              
              <InfoItem 
                icon={<MapPin className="h-5 w-5" />} 
                label="Adresse" 
                value={profileData?.address || ""}
              />
            </div>
            
            <div className="border-t border-bistro-sand pt-6 mt-6">
              <h3 className="text-lg font-playfair font-semibold mb-4 text-bistro-wood">Réseaux Sociaux</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  icon={<Facebook className="h-5 w-5" />} 
                  label="Facebook" 
                  value={profileData?.facebookUrl || ""}
                />
                
                <InfoItem 
                  icon={<Instagram className="h-5 w-5" />} 
                  label="Instagram" 
                  value={profileData?.instagramUrl || ""}
                />
                
                <InfoItem 
                  icon={<Twitter className="h-5 w-5" />} 
                  label="X (Twitter)" 
                  value={profileData?.twitterUrl || ""}
                />
                
                <InfoItem 
                  icon={<Youtube className="h-5 w-5" />} 
                  label="YouTube" 
                  value={profileData?.youtubeUrl || ""}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
