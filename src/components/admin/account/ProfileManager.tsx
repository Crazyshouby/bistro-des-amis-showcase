
import { useState, useEffect } from "react";
import { ProfileView } from "./ProfileView";
import { ProfileForm } from "./ProfileForm";
import { ProfileData, loadUserProfile, saveUserProfile, hasProfileData } from "./profileUtils";
import { User } from "@supabase/supabase-js";

interface ProfileManagerProps {
  user: User | null;
}

export const ProfileManager = ({ user }: ProfileManagerProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setLoading(true);
        const data = await loadUserProfile(user);
        setProfileData(data);
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bistro-olive"></div>
      </div>
    );
  }

  const hasProfile = hasProfileData(profileData);

  const handleSaveProfile = async (data: ProfileData) => {
    if (user) {
      const success = await saveUserProfile(data, user);
      if (success) {
        setProfileData(data);
        setIsEditing(false);
      }
    }
  };

  if (isEditing || !hasProfile) {
    return (
      <ProfileForm 
        initialData={profileData || {
          fullName: "",
          phone: "",
          email: "",
          address: "",
          facebookUrl: "",
          instagramUrl: "",
          twitterUrl: "",
          youtubeUrl: ""
        }}
        onSubmit={handleSaveProfile}
      />
    );
  }

  return (
    <ProfileView 
      profileData={profileData} 
      onEditClick={() => setIsEditing(true)} 
    />
  );
};
