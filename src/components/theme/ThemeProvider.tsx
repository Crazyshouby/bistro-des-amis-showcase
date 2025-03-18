
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeImages {
  homeImageUrl: string;
  menuHeaderImage: string;
  eventsHeaderImage: string;
  contactHeaderImage: string;
}

interface ThemeContextType {
  images: ThemeImages;
  isLoading: boolean;
}

const defaultImages: ThemeImages = {
  homeImageUrl: "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png",
  menuHeaderImage: "/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png",
  eventsHeaderImage: "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png",
  contactHeaderImage: "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png"
};

const ThemeContext = createContext<ThemeContextType>({
  images: defaultImages,
  isLoading: true
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ThemeImages>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemeData = async () => {
      try {
        console.log("Fetching theme data from Supabase...");
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .eq('key', 'home_image_url');

        if (error) {
          console.error('Error fetching theme data:', error);
          return;
        }

        console.log("Theme data received:", data);
        
        if (data && data.length > 0) {
          const newImages = { ...defaultImages };
          
          data.forEach(item => {
            if (item.key === 'home_image_url' && item.value) {
              newImages.homeImageUrl = item.value;
            }
          });
          
          setImages(newImages);
          console.log("Applied theme images:", newImages);
        } else {
          console.log("No theme data found, using defaults");
        }
      } catch (error) {
        console.error('Error in theme loading:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemeData();
    
    // Configure real-time listener for configuration changes
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
    <ThemeContext.Provider value={{ images, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};
