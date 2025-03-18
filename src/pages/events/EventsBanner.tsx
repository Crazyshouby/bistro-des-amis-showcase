
import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

const EventsBanner = () => {
  const { images } = useTheme();
  const [bannerImage, setBannerImage] = useState(images.eventsHeaderImage || "/lovable-uploads/00ac4d79-14ae-4287-8ca4-c2b40d004275.png");
  
  useEffect(() => {
    // S'assurer que l'image est mise à jour quand le thème change
    if (images.eventsHeaderImage) {
      setBannerImage(images.eventsHeaderImage);
    }
  }, [images]);
  
  return (
    <div 
      className="relative h-64 bg-cover bg-center"
      style={{ backgroundImage: `url('${bannerImage}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative h-full flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Nos Événements</h1>
      </div>
    </div>
  );
};

export default EventsBanner;
