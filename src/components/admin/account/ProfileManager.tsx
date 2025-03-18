
import { useState, useEffect } from "react";
import { ProfileView } from "./ProfileView";
import { ProfileForm } from "./ProfileForm";
import { ProfileData, loadUserProfile, hasProfileData } from "./profileUtils";
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

  if (isEditing || !hasProfile) {
    return (
      <ProfileForm 
        initialData={profileData}
        user={user}
        onSuccess={(data) => {
          setProfileData(data);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(hasProfile)}
      />
    );
  }

  return (
    <ProfileView 
      profileData={profileData} 
      onEdit={() => setIsEditing(true)} 
    />
  );
};
