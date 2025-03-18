
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  headerFooterColor: string;
  navigationTextColor: string;
  eventsTitleColor: string;
  eventsSubtitleColor: string;
}

interface ThemeImages {
  homeImageUrl: string;
  menuHeaderImage: string;
  eventsHeaderImage: string;
  contactHeaderImage: string;
}

interface ThemeTexts {
  eventsTitle: string;
  eventsSubtitle: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  images: ThemeImages;
  texts: ThemeTexts;
  isLoading: boolean;
}

const defaultColors: ThemeColors = {
  backgroundColor: "#F5E9D7", // bistro-sand
  textColor: "#3A2E1F", // bistro-wood
  buttonColor: "#4A5E3A", // bistro-olive
  headerFooterColor: "#6B2D2D", // bistro-brick
  navigationTextColor: "#FFFFFF", // blanc par défaut
  eventsTitleColor: "#3A2E1F", // bistro-wood
  eventsSubtitleColor: "#5A4B37", // bistro-wood-light
};

const defaultImages: ThemeImages = {
  homeImageUrl: "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png",
  menuHeaderImage: "",
  eventsHeaderImage: "",
  contactHeaderImage: ""
};

const defaultTexts: ThemeTexts = {
  eventsTitle: "Activités & Divertissements",
  eventsSubtitle: "Découvrez notre programmation d'événements spéciaux: soirées musicales, dégustations, quiz et bien plus encore.",
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  images: defaultImages,
  texts: defaultTexts,
  isLoading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [images, setImages] = useState<ThemeImages>(defaultImages);
  const [texts, setTexts] = useState<ThemeTexts>(defaultTexts);
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
          const newTexts = { ...defaultTexts };
          
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
              case 'navigation_text_color':
                newColors.navigationTextColor = item.value;
                break;
              case 'events_title_color':
                newColors.eventsTitleColor = item.value;
                break;
              case 'events_subtitle_color':
                newColors.eventsSubtitleColor = item.value;
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
                
              // Texts
              case 'events_title':
                if (item.value) newTexts.eventsTitle = item.value;
                break;
              case 'events_subtitle':
                if (item.value) newTexts.eventsSubtitle = item.value;
                break;
            }
          });
          
          setColors(newColors);
          setImages(newImages);
          setTexts(newTexts);
          console.log("Applied theme colors:", newColors);
          console.log("Applied theme images:", newImages);
          console.log("Applied theme texts:", newTexts);
          
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
      document.documentElement.style.setProperty('--dynamic-navigation-text', colors.navigationTextColor);
      document.documentElement.style.setProperty('--dynamic-events-title', colors.eventsTitleColor);
      document.documentElement.style.setProperty('--dynamic-events-subtitle', colors.eventsSubtitleColor);
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
    <ThemeContext.Provider value={{ colors, images, texts, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
