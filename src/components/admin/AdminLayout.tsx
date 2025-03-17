
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <div className="bg-texture">
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">{title}</h1>
        </div>
      </div>
      
      <section className="py-16 md:py-24">
        <div className="content-container">
          {children}
        </div>
      </section>
    </div>
  );
};
