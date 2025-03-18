
import { User } from "@supabase/supabase-js";
import { LogOut, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useEditMode } from "@/components/edit/EditModeProvider";

interface AdminHeaderProps {
  user: User | null;
  signOut: () => Promise<void>;
  isMobile?: boolean;
}

export const AdminHeader = ({ user, signOut, isMobile }: AdminHeaderProps) => {
  const [customizationEnabled, setCustomizationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setEditMode } = useEditMode();

  useEffect(() => {
    const fetchFeatureStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('features')
          .select('enabled')
          .eq('name', 'site_customization')
          .single();
          
        if (error) {
          console.error('Erreur lors de la récupération du statut de la fonctionnalité:', error);
          return;
        }
        
        setCustomizationEnabled(data?.enabled || false);
      } catch (error) {
        console.error('Erreur inattendue:', error);
      }
    };
    
    fetchFeatureStatus();
  }, []);

  const toggleCustomization = async () => {
    setLoading(true);
    try {
      const newStatus = !customizationEnabled;
      
      const { error } = await supabase
        .from('features')
        .update({ enabled: newStatus })
        .eq('name', 'site_customization');
        
      if (error) {
        throw error;
      }
      
      setCustomizationEnabled(newStatus);
      setEditMode(false);
      
      toast({
        title: newStatus ? "Personnalisation activée" : "Personnalisation désactivée",
        description: newStatus 
          ? "Vous pouvez maintenant personnaliser le contenu du site." 
          : "Le mode de personnalisation a été désactivé.",
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de la personnalisation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-playfair text-bistro-wood break-words">
          {isMobile ? 'Bienvenue' : `Bienvenue, ${user?.email}`}
        </h2>
        {isMobile && user?.email && (
          <p className="text-sm text-bistro-wood/70 break-words">{user?.email}</p>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="flex items-center gap-2 border rounded-md p-2 border-bistro-olive">
          <Wand2 className="h-4 w-4 text-bistro-olive" />
          <span className="text-sm text-bistro-olive">Personnalisation</span>
          <Switch 
            checked={customizationEnabled} 
            onCheckedChange={toggleCustomization}
            disabled={loading}
            className="data-[state=checked]:bg-bistro-olive"
          />
        </div>
        <Button 
          onClick={signOut}
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white w-full md:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};
