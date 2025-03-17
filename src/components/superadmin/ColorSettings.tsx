
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Paintbrush, RefreshCw, Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ColorConfig {
  id: string;
  name: string;
  value: string;
  variable: string;
  description: string;
}

export const ColorSettings = () => {
  const [colors, setColors] = useState<ColorConfig[]>([
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
  ]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('type', 'color')
          .order('id');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const loadedColors = data.map(item => ({
            id: item.key,
            name: item.name,
            value: item.value,
            variable: `--bistro-${item.key}`,
            description: item.description || ""
          }));
          
          setColors(loadedColors);
          
          // Apply loaded colors to the DOM
          loadedColors.forEach(color => {
            document.documentElement.style.setProperty(`--bistro-${color.id}`, color.value);
          });
        } else {
          // If no colors found in DB, save the default ones
          saveDefaultColors();
        }
      } catch (error) {
        console.error('Error loading colors:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les couleurs depuis la base de données.",
          variant: "destructive"
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadColors();
  }, []);

  const saveDefaultColors = async () => {
    try {
      // First, remove any existing color settings
      await supabase
        .from('site_settings')
        .delete()
        .eq('type', 'color');
      
      // Then insert the default colors
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
    
    const defaultColors = {
      "brick": "#C14D33",
      "brick-light": "#E7BAA0",
      "sand": "#F5DEB3",
      "sand-light": "#FFF8E7",
      "wood": "#8B4513",
      "wood-light": "#C19A6B",
      "olive": "#556B2F",
      "olive-light": "#8A9A5B"
    };
    
    try {
      // Update colors in state
      setColors(prevColors => 
        prevColors.map(color => ({
          ...color,
          value: defaultColors[color.id as keyof typeof defaultColors]
        }))
      );
      
      // Reset CSS variables
      Object.entries(defaultColors).forEach(([id, value]) => {
        document.documentElement.style.setProperty(`--bistro-${id}`, value);
      });
      
      // Update in database
      await saveColorChanges(
        prevColors => prevColors.map(color => ({
          ...color,
          value: defaultColors[color.id as keyof typeof defaultColors]
        }))
      );
      
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

  const saveColorChanges = async (colorsToSave = colors) => {
    setLoading(true);
    
    try {
      // Update the database
      // First, remove existing color settings
      await supabase
        .from('site_settings')
        .delete()
        .eq('type', 'color');
      
      // Then insert the new values
      const colorData = colorsToSave.map(color => ({
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
    } catch (error) {
      console.error('Error saving colors:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les couleurs.",
        variant: "destructive"
      });
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
          <Button onClick={() => saveColorChanges()} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colors.map((color) => (
          <Card key={color.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Paintbrush className="mr-2 h-5 w-5" />
                {color.name}
              </CardTitle>
              <CardDescription>
                {color.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-md border"
                  style={{ backgroundColor: color.value }}
                ></div>
                <div className="flex-1">
                  <Label htmlFor={`color-${color.id}`} className="mb-1 block">
                    Code couleur
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`color-${color.id}`}
                      type="color"
                      className="w-16"
                      value={color.value}
                      onChange={(e) => handleColorChange(color.id, e.target.value)}
                    />
                    <Input
                      type="text"
                      value={color.value}
                      onChange={(e) => handleColorChange(color.id, e.target.value)}
                      className="font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
