
import { StandardPageData, MenuPageData } from './content-loader';

/**
 * Applique les styles dynamiques à partir des données de page
 */
export function applyPageStyles(pageData: StandardPageData | MenuPageData) {
  const root = document.documentElement;
  
  if (pageData.styling) {
    if (pageData.styling.h1Color) {
      root.style.setProperty('--h1-color', pageData.styling.h1Color);
    }
    
    if (pageData.styling.h2Color) {
      root.style.setProperty('--h2-color', pageData.styling.h2Color);
    }
    
    if (pageData.styling.backgroundColor) {
      root.style.setProperty('--dynamic-background', pageData.styling.backgroundColor);
    }
    
    if (pageData.styling.accentColor) {
      root.style.setProperty('--dynamic-button', pageData.styling.accentColor);
    }
  }
}

/**
 * Réinitialise les styles dynamiques
 */
export function resetPageStyles() {
  const root = document.documentElement;
  
  root.style.removeProperty('--h1-color');
  root.style.removeProperty('--h2-color');
  root.style.removeProperty('--dynamic-background');
  root.style.removeProperty('--dynamic-button');
}
