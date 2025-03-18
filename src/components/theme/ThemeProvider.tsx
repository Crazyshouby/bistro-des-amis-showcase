import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  headerFooterColor: string;
  featureCardBg?: string;
  featuresSectionBg?: string;
}

interface ThemeImages {
  homeImageUrl: string;
  menuHeaderImage: string;
  eventsHeaderImage: string;
  contactHeaderImage: string;
  historyImageUrl?: string;
}

interface ThemeTextContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroTitleFont?: string;
  heroTitleColor?: string;
  heroSubtitleColor?: string;
  historyTitle?: string;
  historyText?: string;
  historyText2?: string;
  historyTitleColor?: string;
  historyTextColor?: string;
  historyTitleFont?: string;
  featuresTitle?: string;
  features?: string;
  featureTitleColor?: string;
  featureTextColor?: string;
  featureTitleFont?: string;
  galleryTitle?: string;
  galleryImages?: string;
  galleryTitleColor?: string;
  galleryTitleFont?: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  images: ThemeImages;
  textContent: ThemeTextContent;
  isLoading: boolean;
  refreshTheme: () => Promise<void>;
  updateTheme: (updates: {
    colors?: Partial<ThemeColors>;
    images?: Partial<ThemeImages>;
    textContent?: Partial<ThemeTextContent>;
  }) => Promise<void>;
}

const defaultColors: ThemeColors = {
  backgroundColor: "#F5E9D7", // bistro-sand
  textColor: "#3A2E1F", // bistro-wood
  buttonColor: "#4A5E3A", // bistro-olive
  headerFooterColor: "#6B2D2D", // bistro-brick
  featureCardBg: "#F5E9D7", // bistro-sand-light
  featuresSectionBg: "#F5E9D7", // bistro-sand
};

const defaultImages: ThemeImages = {
  homeImageUrl: "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png",
  menuHeaderImage: "",
  eventsHeaderImage: "",
  contactHeaderImage: "",
  historyImageUrl: "/lovable-uploads/124dcbfa-dac8-4b14-ab31-905afc4085d6.png",
};

const defaultTextContent: ThemeTextContent = {
  heroTitle: "Bienvenue au Bistro des Amis",
  heroSubtitle: "Votre pause gourmande à Verdun",
  heroTitleFont: "Playfair Display",
  heroTitleColor: "#F5E9D7",
  heroSubtitleColor: "#F5E9D7",
  historyTitle: "Notre Histoire",
  historyText: "Un bistro rustique au cœur de Verdun, où bonne cuisine et ambiance conviviale se rencontrent. Ouvert depuis 1930, le Bistro des Amis perpétue la tradition d'une cuisine authentique dans un cadre chaleureux.",
  historyText2: "Notre philosophie est simple : des produits frais, des plats savoureux et un service attentionné. Que ce soit pour un déjeuner rapide, un dîner en famille ou un souper entre amis, notre équipe vous accueille avec le sourire.",
  historyTitleColor: "#3A2E1F",
  historyTextColor: "#3A2E1F",
  historyTitleFont: "Playfair Display",
  featuresTitle: "Ce qui nous distingue",
  features: JSON.stringify([
    {
      id: "1",
      title: "Cuisine maison",
      description: "Des plats préparés avec passion à partir d'ingrédients frais et de saison."
    },
    {
      id: "2",
      title: "Ambiance chaleureuse", 
      description: "Un cadre rustique et convivial pour des moments inoubliables entre amis ou en famille."
    },
    {
      id: "3",
      title: "Tradition depuis 1930",
      description: "L'authenticité d'un bistro qui a traversé les décennies en conservant son âme."
    }
  ]),
  featureTitleColor: "#4A5E3A",
  featureTextColor: "#3A2E1F",
  featureTitleFont: "Playfair Display",
  galleryTitle: "Notre univers",
  galleryTitleColor: "#3A2E1F",
  galleryTitleFont: "Playfair Display",
};

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultColors,
  images: defaultImages,
  textContent: defaultTextContent,
  isLoading: true,
  refreshTheme: async () => {},
  updateTheme: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [images, setImages] = useState<ThemeImages>(defaultImages);
  const [textContent, setTextContent] = useState<ThemeTextContent>(defaultTextContent);
  const [isLoading, setIsLoading] = useState(true);

  const fetchThemeData = async () => {
    try {
      console.log("Fetching theme data from Supabase...");
      setIsLoading(true);
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
        const newTextContent = { ...defaultTextContent };
        
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
            case 'feature_card_bg':
              newColors.featureCardBg = item.value;
              break;
            case 'features_section_bg':
              newColors.featuresSectionBg = item.value;
              break;
            
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
            case 'history_image_url':
              if (item.value) newImages.historyImageUrl = item.value;
              break;
              
            case 'hero_title':
              newTextContent.heroTitle = item.value;
              break;
            case 'hero_subtitle':
              newTextContent.heroSubtitle = item.value;
              break;
            case 'hero_title_font':
              newTextContent.heroTitleFont = item.value;
              break;
            case 'hero_title_color':
              newTextContent.heroTitleColor = item.value;
              break;
            case 'hero_subtitle_color':
              newTextContent.heroSubtitleColor = item.value;
              break;
            case 'history_title':
              newTextContent.historyTitle = item.value;
              break;
            case 'history_text':
              newTextContent.historyText = item.value;
              break;
            case 'history_text_2':
              newTextContent.historyText2 = item.value;
              break;
            case 'history_title_color':
              newTextContent.historyTitleColor = item.value;
              break;
            case 'history_text_color':
              newTextContent.historyTextColor = item.value;
              break;
            case 'history_title_font':
              newTextContent.historyTitleFont = item.value;
              break;
            case 'features_title':
              newTextContent.featuresTitle = item.value;
              break;
            case 'features':
              newTextContent.features = item.value;
              break;
            case 'feature_title_color':
              newTextContent.featureTitleColor = item.value;
              break;
            case 'feature_text_color':
              newTextContent.featureTextColor = item.value;
              break;
            case 'feature_title_font':
              newTextContent.featureTitleFont = item.value;
              break;
            case 'gallery_title':
              newTextContent.galleryTitle = item.value;
              break;
            case 'gallery_images':
              newTextContent.galleryImages = item.value;
              break;
            case 'gallery_title_color':
              newTextContent.galleryTitleColor = item.value;
              break;
            case 'gallery_title_font':
              newTextContent.galleryTitleFont = item.value;
              break;
          }
        });
        
        setColors(newColors);
        setImages(newImages);
        setTextContent(newTextContent);
        console.log("Applied theme colors:", newColors);
        console.log("Applied theme images:", newImages);
        console.log("Applied theme text content:", newTextContent);
        
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

  const applyColors = (colors: ThemeColors) => {
    document.documentElement.style.setProperty('--dynamic-background', colors.backgroundColor);
    document.documentElement.style.setProperty('--dynamic-text', colors.textColor);
    document.documentElement.style.setProperty('--dynamic-button', colors.buttonColor);
    document.documentElement.style.setProperty('--dynamic-header-footer', colors.headerFooterColor);
    document.documentElement.style.setProperty('--dynamic-feature-card-bg', colors.featureCardBg || colors.backgroundColor);
    document.documentElement.style.setProperty('--dynamic-features-section-bg', colors.featuresSectionBg || colors.backgroundColor);
  };

  const updateTheme = async (updates: {
    colors?: Partial<ThemeColors>;
    images?: Partial<ThemeImages>;
    textContent?: Partial<ThemeTextContent>;
  }) => {
    try {
      console.log("Updating theme with:", updates);
      
      if (updates.colors) {
        const newColors = { ...colors, ...updates.colors };
        
        const colorUpserts = Object.entries(updates.colors).map(([key, value]) => {
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          return {
            key: snakeKey,
            value: value
          };
        });
        
        if (colorUpserts.length > 0) {
          const { error } = await supabase
            .from('site_config')
            .upsert(colorUpserts);
            
          if (error) throw error;
        }
        
        setColors(newColors);
        applyColors(newColors);
      }
      
      if (updates.images) {
        const newImages = { ...images, ...updates.images };
        console.log("Updating images to:", newImages);
        
        const imageUpserts = Object.entries(updates.images).map(([key, value]) => {
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          console.log(`Preparing to upsert ${snakeKey} with value ${value}`);
          return {
            key: snakeKey,
            value: value
          };
        });
        
        if (imageUpserts.length > 0) {
          console.log("Upserting images:", imageUpserts);
          const { data, error } = await supabase
            .from('site_config')
            .upsert(imageUpserts);
            
          if (error) {
            console.error("Error upserting images:", error);
            throw error;
          }
          
          console.log("Upsert response:", data);
        }
        
        setImages(newImages);
      }
      
      if (updates.textContent) {
        const newTextContent = { ...textContent, ...updates.textContent };
        
        const textUpserts = Object.entries(updates.textContent).map(([key, value]) => {
          const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          return {
            key: snakeKey,
            value: value
          };
        });
        
        if (textUpserts.length > 0) {
          const { error } = await supabase
            .from('site_config')
            .upsert(textUpserts);
            
          if (error) throw error;
        }
        
        setTextContent(newTextContent);
      }
      
      console.log("Theme updated successfully");
      
      await fetchThemeData();
    } catch (error) {
      console.error('Error updating theme:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    fetchThemeData();
    
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
    <ThemeContext.Provider value={{ 
      colors, 
      images, 
      textContent, 
      isLoading, 
      refreshTheme: fetchThemeData,
      updateTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
