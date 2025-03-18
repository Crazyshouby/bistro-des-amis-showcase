
import React from "react";

const MenuBanner = () => {
  return (
    <div 
      className="relative h-64 bg-cover bg-center"
      style={{ backgroundImage: "url('/lovable-uploads/19408610-7939-4299-999c-208a2355a264.png')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative h-full flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Notre Menu</h1>
      </div>
    </div>
  );
};

export default MenuBanner;
