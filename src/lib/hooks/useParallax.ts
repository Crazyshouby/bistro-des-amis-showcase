
import { useRef, useEffect } from "react";

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
