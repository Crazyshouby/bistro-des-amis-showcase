
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  headerFooterColor: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  isLoading: boolean;
}

const defaultColors: ThemeColors = {
  backgroundColor: "#F5E9D7", // bistro-sand
  textColor: "#3A2E1F", // bistro-wood
  buttonColor: "#4A5E3A", // bistro-olive
  headerFooterColor: "#6B2D2D" // bistro-brick
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  isLoading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        console.log("Fetching theme colors from Supabase...");
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['background_color', 'text_color', 'button_color', 'header_footer_color']);

        if (error) {
          console.error('Error fetching theme colors:', error);
          return;
        }

        console.log("Theme data received:", data);
        
        if (data && data.length > 0) {
          const newColors = { ...defaultColors };
          
          data.forEach(item => {
            switch (item.key) {
              case 'background_color':
                newColors.backgroundColor = item.value;
                break;
              case 'text_color':
                newColors.textColor = item.value;
                break;
              case 'button_color':
                newColors.buttonColor = item.value;
                break;
              case 'header_footer_color':
                newColors.headerFooterColor = item.value;
                break;
            }
          });
          
          setColors(newColors);
          console.log("Applied theme colors:", newColors);
          
          // Appliquer les couleurs au document
          applyColors(newColors);
        } else {
          console.log("No theme colors found, using defaults");
          applyColors(defaultColors);
        }
      } catch (error) {
        console.error('Error in theme loading:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fonction pour appliquer les couleurs dynamiquement
    const applyColors = (colors: ThemeColors) => {
      document.documentElement.style.setProperty('--dynamic-background', colors.backgroundColor);
      document.documentElement.style.setProperty('--dynamic-text', colors.textColor);
      document.documentElement.style.setProperty('--dynamic-button', colors.buttonColor);
      document.documentElement.style.setProperty('--dynamic-header-footer', colors.headerFooterColor);
    };
    
    fetchColors();
    
    // Configurer un écouteur temps réel pour les changements de configuration
    const subscription = supabase
      .channel('site_config_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_config',
          filter: `key=in.(background_color,text_color,button_color,header_footer_color)`
        },
        async (payload) => {
          console.log('Theme config changed:', payload);
          await fetchColors();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
