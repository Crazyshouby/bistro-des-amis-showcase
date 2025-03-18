
import * as React from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";

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

// Hook pour les animations au scroll
export const useIntersectionObserver = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isIntersecting] as const;
};

// Hook pour l'effet parallax
export const useParallax = (speed = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollY = window.scrollY;
        const yPos = -scrollY * speed;
        ref.current.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
};

// Hook pour le focus initial d'un élément
export const useFocus = () => {
  const ref = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  
  return ref;
};

// Hook pour la détection de la taille de la fenêtre
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
