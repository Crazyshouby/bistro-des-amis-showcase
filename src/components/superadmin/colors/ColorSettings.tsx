
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ColorCard } from "./ColorCard";
import { ColorConfig } from "./types";
import { 
  applyColorsToCss, 
  getInitialColors, 
  loadColorsFromDb, 
  saveColorChangesToDb, 
  defaultColors 
} from "./colorUtils";

export const ColorSettings = () => {
  const [colors, setColors] = useState<ColorConfig[]>(getInitialColors());
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initializeColors = async () => {
      try {
        const loadedColors = await loadColorsFromDb();
        
        if (loadedColors && loadedColors.length > 0) {
          setColors(loadedColors);
          
          // Apply loaded colors to the DOM
          applyColorsToCss(loadedColors);
        } else {
          // If no colors found in DB, save the default ones
          saveDefaultColors();
        }
      } catch (error) {
        console.error('Error initializing colors:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeColors();
  }, []);

  const saveDefaultColors = async () => {
    try {
      await saveColorChangesToDb(colors);
    } catch (error) {
      console.error('Error saving default colors:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les couleurs par défaut.",
        variant: "destructive"
      });
    }
  };

  const handleColorChange = (id: string, newValue: string) => {
    setColors(prevColors => 
      prevColors.map(color => 
        color.id === id 
          ? { ...color, value: newValue } 
          : color
      )
    );
    
    // Update CSS variable in real-time
    document.documentElement.style.setProperty(`--bistro-${id}`, newValue);
  };

  const resetColors = async () => {
    setLoading(true);
    
    try {
      // Update colors in state
      const updatedColors = colors.map(color => ({
        ...color,
        value: defaultColors[color.id as keyof typeof defaultColors]
      }));
      
      setColors(updatedColors);
      
      // Reset CSS variables
      Object.entries(defaultColors).forEach(([id, value]) => {
        document.documentElement.style.setProperty(`--bistro-${id}`, value);
      });
      
      // Update in database
      await saveColorChangesToDb(updatedColors);
      
      toast({
        title: "Couleurs réinitialisées",
        description: "Les couleurs ont été réinitialisées aux valeurs par défaut."
      });
    } catch (error) {
      console.error('Error resetting colors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les couleurs.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveColorChanges = async () => {
    setLoading(true);
    
    try {
      await saveColorChangesToDb(colors);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center py-12">Chargement des couleurs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des couleurs du site</h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={resetColors} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Réinitialiser
          </Button>
          <Button onClick={saveColorChanges} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colors.map((color) => (
          <ColorCard
            key={color.id}
            color={color}
            onColorChange={handleColorChange}
          />
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted rounded-md flex items-start">
        <Info className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Les modifications de couleurs sont appliquées en temps réel et sauvegardées dans la base de données pour être persistantes.
        </p>
      </div>
    </div>
  );
};
