
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { AnimatedSectionProps } from "@/types";

const AnimatedSection = ({ 
  children, 
  className, 
  delay = 0,
  direction = 'up' 
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return "";
    
    const baseClass = "transition-all duration-700";
    const delayClass = delay ? `delay-[${delay}ms]` : "";
    
    switch (direction) {
      case 'up':
        return `${baseClass} ${delayClass} animate-fade-in-up`;
      case 'right':
        return `${baseClass} ${delayClass} animate-slide-in-right`;
      case 'left':
        return `${baseClass} ${delayClass} translate-x-0 opacity-100`;
      case 'down':
        return `${baseClass} ${delayClass} translate-y-0 opacity-100`;
      default:
        return `${baseClass} ${delayClass} animate-fade-in-up`;
    }
  };

  const getInitialStyles = () => {
    if (isVisible) return {};

    switch (direction) {
      case 'up':
        return { transform: 'translateY(40px)', opacity: 0 };
      case 'right':
        return { transform: 'translateX(-40px)', opacity: 0 };
      case 'left':
        return { transform: 'translateX(40px)', opacity: 0 };
      case 'down':
        return { transform: 'translateY(-40px)', opacity: 0 };
      default:
        return { transform: 'translateY(40px)', opacity: 0 };
    }
  };

  return (
    <div
      ref={ref}
      className={cn(className, getAnimationClass())}
      style={{
        ...getInitialStyles(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
