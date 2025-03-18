
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
  setEditMode: () => {},
});

export const useEditMode = () => useContext(EditModeContext);

interface EditModeProviderProps {
  children: React.ReactNode;
  initialEditMode?: boolean;
}

export const EditModeProvider: React.FC<EditModeProviderProps> = ({ 
  children, 
  initialEditMode = false 
}) => {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  useEffect(() => {
    // Vérifier si la fonctionnalité est activée
    const checkFeatureEnabled = async () => {
      try {
        const { data, error } = await supabase
          .from('features')
          .select('enabled')
          .eq('name', 'site_customization')
          .single();

        if (error) {
          console.error('Erreur lors de la vérification de la fonctionnalité:', error);
          return;
        }

        setIsFeatureEnabled(data?.enabled || false);
        
        // Si la fonctionnalité est désactivée, on désactive aussi le mode édition
        if (!data?.enabled) {
          setIsEditMode(false);
        }
      } catch (error) {
        console.error('Erreur inattendue:', error);
      }
    };

    checkFeatureEnabled();

    // S'abonner aux changements de la fonctionnalité
    const subscription = supabase
      .channel('features-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'features',
        filter: 'name=eq.site_customization'
      }, (payload) => {
        const enabled = (payload.new as any).enabled;
        setIsFeatureEnabled(enabled);
        if (!enabled) {
          setIsEditMode(false);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleEditMode = () => {
    if (isFeatureEnabled) {
      setIsEditMode(prev => !prev);
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, setEditMode: setIsEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};
