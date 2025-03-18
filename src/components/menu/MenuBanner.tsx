
import React from "react";

interface MenuBannerProps {
  bannerImage?: string;
}

const MenuBanner: React.FC<MenuBannerProps> = ({ bannerImage }) => {
  return (
    <div className="relative h-64 md:h-96 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bannerImage || "/lovable-uploads/a801663d-ec08-448a-a543-cfeccd30346d.png"}')` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-bistro-sand">
            Notre Menu
          </h1>
        </div>
      </div>
    </div>
  );
};

export default MenuBanner;
