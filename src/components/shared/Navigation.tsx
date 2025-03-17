
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useNavigation } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const { isScrolled, isOpen, setIsOpen } = useNavigation();
  const location = useLocation();
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
          setIsOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-playfair",
        isScrolled 
          ? "bg-bistro-sand shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="content-container flex justify-between items-center">
        <Link to="/" className="flex items-center transform transition hover:scale-105 duration-300">
          <span className={cn(
            "text-2xl md:text-3xl font-bold transition-all duration-300",
            isScrolled ? "text-bistro-wood" : "text-bistro-sand-light"
          )}>
            Bistro des Amis
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { path: "/", label: "Accueil" },
            { path: "/menu", label: "Menu" },
            { path: "/events", label: "Événements" },
            { path: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative text-lg font-medium transition-all duration-300 hover:text-bistro-brick",
                isScrolled ? "text-bistro-wood" : "text-bistro-sand-light",
                location.pathname === item.path && "after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-bistro-brick"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "menu-button md:hidden transition-all duration-300",
            isScrolled ? "text-bistro-wood" : "text-bistro-sand-light",
            "hover:bg-transparent hover:text-bistro-brick"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "mobile-menu absolute top-full left-0 right-0 bg-bistro-sand shadow-lg overflow-hidden transition-all duration-300 md:hidden",
          isOpen ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="content-container py-4 flex flex-col space-y-4">
          {[
            { path: "/", label: "Accueil" },
            { path: "/menu", label: "Menu" },
            { path: "/events", label: "Événements" },
            { path: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-lg font-medium py-2 text-bistro-wood transition-all duration-300 hover:text-bistro-brick",
                location.pathname === item.path && "text-bistro-brick"
              )}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
