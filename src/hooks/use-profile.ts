
import { useReducer, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, profileSchema } from "@/components/admin/account/profileUtils";

type ProfileState = {
  data: ProfileData | null;
  isEditing: boolean;
  isSaving: boolean;
};

type ProfileAction = 
  | { type: 'SET_DATA'; payload: ProfileData | null }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean };

const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};

export const useProfile = (user: User | null) => {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(profileReducer, {
    data: null,
    isEditing: false,
    isSaving: false,
  });

  // Fetch profile data
  const { isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
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
          const mergedData = {
            ...initialData,
            fullName: data.full_name || initialData.fullName,
            facebookUrl: data.facebook_url || initialData.facebookUrl,
            instagramUrl: data.instagram_url || initialData.instagramUrl,
            twitterUrl: data.twitter_url || initialData.twitterUrl,
            youtubeUrl: data.youtube_url || initialData.youtubeUrl,
          };
          
          dispatch({ type: 'SET_DATA', payload: mergedData });
          return mergedData;
        }
        
        dispatch({ type: 'SET_DATA', payload: initialData });
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
    },
    enabled: !!user,
  });

  // Save profile mutation
  const mutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      if (!user) throw new Error("User not authenticated");
      
      dispatch({ type: 'SET_SAVING', payload: true });
      
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
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: data.fullName,
            email: data.email,
            facebook_url: data.facebookUrl,
            instagram_url: data.instagramUrl,
            twitter_url: data.twitterUrl,
            youtube_url: data.youtubeUrl,
          });

        if (profileError) throw profileError;
        
        return data;
      } catch (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la mise à jour du profil.",
          variant: "destructive",
        });
        throw error;
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_DATA', payload: data });
      dispatch({ type: 'SET_EDITING', payload: false });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
      
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    }
  });

  const hasProfileData = (data: ProfileData | null): boolean => {
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

  return {
    profileData: state.data,
    isLoading,
    isSaving: state.isSaving,
    isEditing: state.isEditing,
    hasProfile: hasProfileData(state.data),
    setEditing: (editing: boolean) => dispatch({ type: 'SET_EDITING', payload: editing }),
    saveProfile: (data: ProfileData) => mutation.mutate(data),
  };
};
