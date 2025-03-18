
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileView } from "./account/ProfileView";
import { ProfileForm } from "./account/ProfileForm";
import { 
  ProfileData, 
  loadUserProfile, 
  saveUserProfile, 
  hasProfileData 
} from "./account/profileUtils";

interface AccountTabProps {
  user: any;
}

export const AccountTab = ({ user }: AccountTabProps) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        setIsLoading(true);
        
        try {
          const data = await loadUserProfile(user);
          setProfileData(data);
          
          // Determine if we should start in edit mode (no data entered yet)
          setEditMode(!hasProfileData(data));
        } catch (error) {
          console.error('Error loading profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleSaveProfile = async (data: ProfileData) => {
    const success = await saveUserProfile(data, user);
    if (success) {
      setProfileData(data);
      setEditMode(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-playfair text-bistro-wood">Informations du Compte</CardTitle>
        </CardHeader>
        <div className="flex justify-center items-center min-h-[300px]">
          <p>Chargement des données...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-playfair text-bistro-wood">Informations du Compte</CardTitle>
        {!editMode && profileData && (
          <Button 
            onClick={() => setEditMode(true)} 
            className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
      </CardHeader>
      
      {editMode && profileData ? (
        <ProfileForm 
          initialData={profileData} 
          onSubmit={handleSaveProfile} 
        />
      ) : (
        <ProfileView 
          profileData={profileData} 
          onEditClick={() => setEditMode(true)} 
        />
      )}
    </Card>
  );
};
