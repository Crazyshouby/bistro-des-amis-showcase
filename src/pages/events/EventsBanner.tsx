
import React from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

const EventsBanner = () => {
  const { images } = useTheme();
  
  // Utiliser l'image d'en-tête des événements depuis le ThemeProvider ou une image par défaut
  const backgroundImage = images.eventsHeaderImage || "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png";

  return (
    <div 
      className="relative h-64 bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative h-full flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Nos Événements</h1>
      </div>
    </div>
  );
};

export default EventsBanner;
