
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface AdvancedColorSettings {
  eventsTitleColor: string;
  eventsSubtitleColor: string;
}

export const AdvancedColorSettings = () => {
  const [colors, setColors] = useState<AdvancedColorSettings>({
    eventsTitleColor: "#3A2E1F", // bistro-wood
    eventsSubtitleColor: "#5A4B37", // bistro-wood-light
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['events_title_color', 'events_subtitle_color']);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const colorData: Partial<AdvancedColorSettings> = {};
          data.forEach(item => {
            switch (item.key) {
              case 'events_title_color':
                colorData.eventsTitleColor = item.value;
                break;
              case 'events_subtitle_color':
                colorData.eventsSubtitleColor = item.value;
                break;
            }
          });

          setColors(prev => ({ ...prev, ...colorData }));
        }
      } catch (error) {
        console.error('Error fetching advanced colors:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les couleurs avancées",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setColors(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const mappings = [
        { dbKey: 'events_title_color', value: colors.eventsTitleColor },
        { dbKey: 'events_subtitle_color', value: colors.eventsSubtitleColor },
      ];

      for (const { dbKey, value } of mappings) {
        const { data: existingData, error: checkError } = await supabase
          .from('site_config')
          .select('id')
          .eq('key', dbKey);

        if (checkError) {
          console.error(`Error checking if ${dbKey} exists:`, checkError);
          continue;
        }

        if (existingData && existingData.length > 0) {
          const { error: updateError } = await supabase
            .from('site_config')
            .update({ value })
            .eq('key', dbKey);

          if (updateError) {
            console.error(`Error updating ${dbKey}:`, updateError);
          }
        } else {
          const { error: insertError } = await supabase
            .from('site_config')
            .insert([{ key: dbKey, value }]);

          if (insertError) {
            console.error(`Error inserting ${dbKey}:`, insertError);
          }
        }
      }

      toast({
        title: "Succès",
        description: "Les couleurs avancées ont été mises à jour",
      });
      
      document.documentElement.style.setProperty('--dynamic-events-title', colors.eventsTitleColor);
      document.documentElement.style.setProperty('--dynamic-events-subtitle', colors.eventsSubtitleColor);
      
    } catch (error) {
      console.error('Error saving advanced colors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les couleurs avancées",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Couleurs spécifiques aux pages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <h3 className="text-lg font-medium mb-4">Page Événements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="eventsTitleColor">Couleur du titre principal</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="eventsTitleColor"
                name="eventsTitleColor"
                value={colors.eventsTitleColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.eventsTitleColor}
                name="eventsTitleColor"
                onChange={handleColorChange}
                className="flex-grow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventsSubtitleColor">Couleur du sous-titre</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="eventsSubtitleColor"
                name="eventsSubtitleColor"
                value={colors.eventsSubtitleColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.eventsSubtitleColor}
                name="eventsSubtitleColor"
                onChange={handleColorChange}
                className="flex-grow"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="font-medium mb-3">Aperçu</h3>
          <div className="border rounded-md p-6 mb-4 bg-bistro-sand">
            <h4 className="text-2xl font-playfair font-bold mb-2" style={{ color: colors.eventsTitleColor }}>
              Activités & Divertissements
            </h4>
            <p className="mb-4" style={{ color: colors.eventsSubtitleColor }}>
              Découvrez notre programmation d'événements spéciaux: soirées musicales, dégustations, quiz et bien plus encore.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer les couleurs"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
