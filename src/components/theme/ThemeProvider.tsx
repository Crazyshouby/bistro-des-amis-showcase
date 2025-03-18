
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  headerFooterColor: string;
}

interface ThemeImages {
  homeImageUrl: string;
  menuHeaderImage: string;
  eventsHeaderImage: string;
  contactHeaderImage: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  images: ThemeImages;
  isLoading: boolean;
}

const defaultColors: ThemeColors = {
  backgroundColor: "#F5E9D7", // bistro-sand
  textColor: "#3A2E1F", // bistro-wood
  buttonColor: "#4A5E3A", // bistro-olive
  headerFooterColor: "#6B2D2D" // bistro-brick
};

const defaultImages: ThemeImages = {
  homeImageUrl: "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png",
  menuHeaderImage: "",
  eventsHeaderImage: "",
  contactHeaderImage: ""
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  images: defaultImages,
  isLoading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [images, setImages] = useState<ThemeImages>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemeData = async () => {
      try {
        console.log("Fetching theme data from Supabase...");
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value');

        if (error) {
          console.error('Error fetching theme data:', error);
          return;
        }

        console.log("Theme data received:", data);
        
        if (data && data.length > 0) {
          const newColors = { ...defaultColors };
          const newImages = { ...defaultImages };
          
          data.forEach(item => {
            switch (item.key) {
              // Colors
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
              
              // Images
              case 'home_image_url':
                if (item.value) newImages.homeImageUrl = item.value;
                break;
              case 'menu_header_image':
                if (item.value) newImages.menuHeaderImage = item.value;
                break;
              case 'events_header_image':
                if (item.value) newImages.eventsHeaderImage = item.value;
                break;
              case 'contact_header_image':
                if (item.value) newImages.contactHeaderImage = item.value;
                break;
            }
          });
          
          setColors(newColors);
          setImages(newImages);
          console.log("Applied theme colors:", newColors);
          console.log("Applied theme images:", newImages);
          
          // Appliquer les couleurs au document
          applyColors(newColors);
        } else {
          console.log("No theme data found, using defaults");
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
    
    fetchThemeData();
    
    // Configurer un écouteur temps réel pour les changements de configuration
    const subscription = supabase
      .channel('site_config_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_config'
        },
        async (payload) => {
          console.log('Theme config changed:', payload);
          await fetchThemeData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, images, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
