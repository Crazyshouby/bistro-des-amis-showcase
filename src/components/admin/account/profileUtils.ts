
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const profileSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export const loadUserProfile = async (user: any) => {
  if (!user) return null;
  
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
      return {
        ...initialData,
        fullName: data.full_name || initialData.fullName,
        facebookUrl: data.facebook_url || initialData.facebookUrl,
        instagramUrl: data.instagram_url || initialData.instagramUrl,
        twitterUrl: data.twitter_url || initialData.twitterUrl,
        youtubeUrl: data.youtube_url || initialData.youtubeUrl,
      };
    }
    
    return initialData;
  } catch (error) {
    console.error('Error loading profile:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les données du profil",
      variant: "destructive",
    });
    return null;
  }
};

export const saveUserProfile = async (data: ProfileData, user: any) => {
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

    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès."
    });
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast({
      title: "Erreur",
      description: "Une erreur s'est produite lors de la mise à jour du profil.",
      variant: "destructive",
    });
    return false;
  }
};

export const hasProfileData = (data: ProfileData | null): boolean => {
  if (!data) return false;
  
  return !!(
    data.fullName || 
    data.phone || 
    data.address || 
    data.facebookUrl || 
    data.instagramUrl || 
    data.twitterUrl || 
    data.youtubeUrl
  );
};
