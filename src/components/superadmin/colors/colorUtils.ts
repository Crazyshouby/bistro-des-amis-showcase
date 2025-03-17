
import { ColorConfig } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const defaultColors = {
  "brick": "#C14D33",
  "brick-light": "#E7BAA0",
  "sand": "#F5DEB3",
  "sand-light": "#FFF8E7",
  "wood": "#8B4513",
  "wood-light": "#C19A6B",
  "olive": "#556B2F",
  "olive-light": "#8A9A5B"
};

export const applyColorsToCss = (colors: ColorConfig[]): void => {
  colors.forEach(color => {
    document.documentElement.style.setProperty(`--bistro-${color.id}`, color.value);
  });
};

export const saveColorChangesToDb = async (colors: ColorConfig[]): Promise<boolean> => {
  try {
    // Remove existing color settings
    await supabase
      .from('site_settings')
      .delete()
      .eq('type', 'color');
    
    // Insert the new values
    const colorData = colors.map(color => ({
      type: 'color',
      key: color.id,
      name: color.name,
      value: color.value,
      description: color.description
    }));
    
    const { error } = await supabase
      .from('site_settings')
      .insert(colorData);
    
    if (error) throw error;
    
    toast({
      title: "Couleurs enregistrées",
      description: "Les modifications de couleurs ont été enregistrées avec succès."
    });
    
    return true;
  } catch (error) {
    console.error('Error saving colors:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'enregistrer les couleurs.",
      variant: "destructive"
    });
    
    return false;
  }
};

export const loadColorsFromDb = async (): Promise<ColorConfig[] | null> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('type', 'color')
      .order('id');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map((item) => ({
        id: item.key,
        name: item.name,
        value: item.value,
        variable: `--bistro-${item.key}`,
        description: item.description || ""
      }));
    }
    
    return null;
  } catch (error) {
    console.error('Error loading colors:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les couleurs depuis la base de données.",
      variant: "destructive"
    });
    
    return null;
  }
};

export const getInitialColors = (): ColorConfig[] => [
  { 
    id: "brick", 
    name: "Brick", 
    value: "#C14D33",
    variable: "--bistro-brick",
    description: "Couleur principale, utilisée pour les titres et les boutons" 
  },
  { 
    id: "brick-light", 
    name: "Brick Light", 
    value: "#E7BAA0", 
    variable: "--bistro-brick-light",
    description: "Version claire de Brick, utilisée pour les arrière-plans" 
  },
  { 
    id: "sand", 
    name: "Sand", 
    value: "#F5DEB3", 
    variable: "--bistro-sand",
    description: "Couleur de fond, utilisée pour les sections et les cartes" 
  },
  { 
    id: "sand-light", 
    name: "Sand Light", 
    value: "#FFF8E7", 
    variable: "--bistro-sand-light",
    description: "Version claire de Sand, utilisée pour le fond des éléments" 
  },
  { 
    id: "wood", 
    name: "Wood", 
    value: "#8B4513", 
    variable: "--bistro-wood",
    description: "Couleur tertiaire, utilisée pour le texte et les bordures" 
  },
  { 
    id: "wood-light", 
    name: "Wood Light", 
    value: "#C19A6B", 
    variable: "--bistro-wood-light",
    description: "Version claire de Wood, utilisée pour les accents" 
  },
  { 
    id: "olive", 
    name: "Olive", 
    value: "#556B2F", 
    variable: "--bistro-olive",
    description: "Couleur secondaire, utilisée pour les boutons et les accents" 
  },
  { 
    id: "olive-light", 
    name: "Olive Light", 
    value: "#8A9A5B", 
    variable: "--bistro-olive-light",
    description: "Version claire de Olive, utilisée pour les états hover" 
  }
];
