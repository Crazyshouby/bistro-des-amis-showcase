
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types for the theme context
type ThemeImages = {
  homeImageUrl?: string;
  menuImageUrl?: string;
  eventsImageUrl?: string;
  contactImageUrl?: string;
};

type ThemeSettings = {
  floatingEffect?: boolean;
};

type ThemeContextType = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  images: ThemeImages;
  settings: ThemeSettings;
  isLoading: boolean;
  setColors: (colors: { [key: string]: string }) => void;
  setImages: (images: ThemeImages) => void;
  setSettings: (settings: ThemeSettings) => void;
};

const defaultContext: ThemeContextType = {
  colors: {
    primary: "#85714D",
    secondary: "#7C3238",
    accent: "#5A5E62",
    background: "#F5F2ED",
    text: "#2A2A2A",
  },
  images: {},
  settings: {},
  isLoading: true,
  setColors: () => {},
  setImages: () => {},
  setSettings: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColorsState] = useState(defaultContext.colors);
  const [images, setImagesState] = useState<ThemeImages>({});
  const [settings, setSettingsState] = useState<ThemeSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  const setColors = (newColors: { [key: string]: string }) => {
    setColorsState((prevColors) => ({
      ...prevColors,
      ...newColors,
    }));
  };

  const setImages = (newImages: ThemeImages) => {
    setImagesState((prevImages) => ({
      ...prevImages,
      ...newImages,
    }));
  };

  const setSettings = (newSettings: ThemeSettings) => {
    setSettingsState((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        // Fetch all site_config entries
        const { data, error } = await supabase
          .from('site_config')
          .select('*');

        if (error) {
          console.error("Error fetching theme settings:", error);
          return;
        }

        // Process color settings
        const newColors = { ...colors };
        const newImages: ThemeImages = { ...images };
        const newSettings: ThemeSettings = { ...settings };

        data.forEach((item) => {
          // Handle color settings
          if (item.key.startsWith('color_')) {
            const colorKey = item.key.replace('color_', '');
            newColors[colorKey as keyof typeof newColors] = item.value;
          }
          // Handle image settings
          else if (item.key === 'home_image_url') {
            newImages.homeImageUrl = item.value;
          }
          else if (item.key === 'menu_image_url') {
            newImages.menuImageUrl = item.value;
          }
          else if (item.key === 'events_image_url') {
            newImages.eventsImageUrl = item.value;
          }
          else if (item.key === 'contact_image_url') {
            newImages.contactImageUrl = item.value;
          }
          // Handle floating effect setting
          else if (item.key === 'home_image_float') {
            newSettings.floatingEffect = item.value === 'true';
          }
        });

        setColorsState(newColors);
        setImagesState(newImages);
        setSettingsState(newSettings);
      } catch (error) {
        console.error("Error in fetchThemeSettings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemeSettings();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        images,
        settings,
        isLoading,
        setColors,
        setImages,
        setSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
