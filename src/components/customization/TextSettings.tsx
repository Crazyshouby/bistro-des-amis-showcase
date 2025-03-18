
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface TextSettings {
  eventsTitle: string;
  eventsSubtitle: string;
}

export const TextSettings = () => {
  const [texts, setTexts] = useState<TextSettings>({
    eventsTitle: "Activités & Divertissements",
    eventsSubtitle: "Découvrez notre programmation d'événements spéciaux: soirées musicales, dégustations, quiz et bien plus encore.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['events_title', 'events_subtitle']);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const textData: Partial<TextSettings> = {};
          data.forEach(item => {
            switch (item.key) {
              case 'events_title':
                textData.eventsTitle = item.value;
                break;
              case 'events_subtitle':
                textData.eventsSubtitle = item.value;
                break;
            }
          });

          setTexts(prev => ({ ...prev, ...textData }));
        }
      } catch (error) {
        console.error('Error fetching texts:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les textes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTexts();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTexts(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const mappings = [
        { dbKey: 'events_title', value: texts.eventsTitle },
        { dbKey: 'events_subtitle', value: texts.eventsSubtitle }
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
        description: "Les textes ont été mis à jour",
      });
      
    } catch (error) {
      console.error('Error saving texts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les textes",
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
        <CardTitle>Personnalisation des textes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventsTitle">Titre de la page Événements</Label>
            <Input
              id="eventsTitle"
              name="eventsTitle"
              value={texts.eventsTitle}
              onChange={handleTextChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventsSubtitle">Sous-titre de la page Événements</Label>
            <Textarea
              id="eventsSubtitle"
              name="eventsSubtitle"
              value={texts.eventsSubtitle}
              onChange={handleTextChange}
              rows={3}
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer les textes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
