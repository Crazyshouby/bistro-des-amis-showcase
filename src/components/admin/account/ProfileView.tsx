
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Edit, User, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { ProfileData } from "./profileUtils";

interface InfoItemProps {
  icon: React.ReactNode; 
  label: string; 
  value: string;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
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

interface ProfileViewProps {
  profileData: ProfileData | null;
  onEditClick: () => void;
}

export const ProfileView = ({ profileData, onEditClick }: ProfileViewProps) => {
  if (!profileData) return null;
  
  return (
    <CardContent>
      <div className="space-y-6">
        <div className="space-y-4">
          <InfoItem 
            icon={<User className="h-5 w-5" />} 
            label="Nom Complet" 
            value={profileData.fullName || ""}
          />
          
          <InfoItem 
            icon={<Phone className="h-5 w-5" />} 
            label="Numéro de Téléphone" 
            value={profileData.phone || ""}
          />
          
          <InfoItem 
            icon={<Mail className="h-5 w-5" />} 
            label="Adresse Email" 
            value={profileData.email || ""}
          />
          
          <InfoItem 
            icon={<MapPin className="h-5 w-5" />} 
            label="Adresse" 
            value={profileData.address || ""}
          />
        </div>
        
        <div className="border-t border-bistro-sand pt-6 mt-6">
          <h3 className="text-lg font-playfair font-semibold mb-4 text-bistro-wood">Réseaux Sociaux</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              icon={<Facebook className="h-5 w-5" />} 
              label="Facebook" 
              value={profileData.facebookUrl || ""}
            />
            
            <InfoItem 
              icon={<Instagram className="h-5 w-5" />} 
              label="Instagram" 
              value={profileData.instagramUrl || ""}
            />
            
            <InfoItem 
              icon={<Twitter className="h-5 w-5" />} 
              label="X (Twitter)" 
              value={profileData.twitterUrl || ""}
            />
            
            <InfoItem 
              icon={<Youtube className="h-5 w-5" />} 
              label="YouTube" 
              value={profileData.youtubeUrl || ""}
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
};
