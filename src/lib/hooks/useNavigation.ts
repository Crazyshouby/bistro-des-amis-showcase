
import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Type de contexte pour la navigation
interface NavigationContextType {
  isScrolled: boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Création du contexte avec valeur par défaut
const NavigationContext = createContext<NavigationContextType>({
  isScrolled: false,
  isOpen: false,
  setIsOpen: () => {},
});

// Hook pour utiliser le contexte de navigation
export const useNavigation = () => useContext(NavigationContext);

// Provider pour le contexte de navigation
export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use createElement instead of JSX since this is a .ts file
  return React.createElement(
    NavigationContext.Provider,
    { value: { isScrolled, isOpen, setIsOpen } },
    children
  );
};
