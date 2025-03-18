
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ColorSettings {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  headerFooterColor: string;
}

export const ColorSettings = () => {
  const [colors, setColors] = useState<ColorSettings>({
    backgroundColor: "#E5E7EB",
    textColor: "#374151",
    buttonColor: "#2DD4BF",
    headerFooterColor: "#6B7280"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', ['background_color', 'text_color', 'button_color', 'header_footer_color']);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const colorData: Partial<ColorSettings> = {};
          data.forEach(item => {
            switch (item.key) {
              case 'background_color':
                colorData.backgroundColor = item.value;
                break;
              case 'text_color':
                colorData.textColor = item.value;
                break;
              case 'button_color':
                colorData.buttonColor = item.value;
                break;
              case 'header_footer_color':
                colorData.headerFooterColor = item.value;
                break;
            }
          });

          setColors(prev => ({ ...prev, ...colorData }));
        }
      } catch (error) {
        console.error('Error fetching colors:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les couleurs",
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
      const updates = [
        { key: 'background_color', value: colors.backgroundColor },
        { key: 'text_color', value: colors.textColor },
        { key: 'button_color', value: colors.buttonColor },
        { key: 'header_footer_color', value: colors.headerFooterColor }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_config')
          .update({ value: update.value })
          .eq('key', update.key);

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Les couleurs ont été mises à jour",
      });
    } catch (error) {
      console.error('Error saving colors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les couleurs",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2DD4BF]"></div>
      </div>
    );
  }

  return (
    <Card className="border border-[#6B7280]">
      <CardHeader className="bg-[#F3F4F6] border-b border-[#6B7280]">
        <CardTitle className="text-[#374151]">Personnalisation des couleurs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor" className="text-[#374151]">Couleur de fond</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="backgroundColor"
                name="backgroundColor"
                value={colors.backgroundColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.backgroundColor}
                name="backgroundColor"
                onChange={handleColorChange}
                className="flex-grow border-[#6B7280]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor" className="text-[#374151]">Couleur du texte</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="textColor"
                name="textColor"
                value={colors.textColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.textColor}
                name="textColor"
                onChange={handleColorChange}
                className="flex-grow border-[#6B7280]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonColor" className="text-[#374151]">Couleur des boutons</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="buttonColor"
                name="buttonColor"
                value={colors.buttonColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.buttonColor}
                name="buttonColor"
                onChange={handleColorChange}
                className="flex-grow border-[#6B7280]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headerFooterColor" className="text-[#374151]">Couleur d'en-tête/pied de page</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                id="headerFooterColor"
                name="headerFooterColor"
                value={colors.headerFooterColor}
                onChange={handleColorChange}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={colors.headerFooterColor}
                name="headerFooterColor"
                onChange={handleColorChange}
                className="flex-grow border-[#6B7280]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-[#374151] font-medium mb-3">Aperçu</h3>
          <div
            className="border rounded-md p-6 mb-4"
            style={{ backgroundColor: colors.backgroundColor }}
          >
            <h4 className="font-medium mb-2" style={{ color: colors.textColor }}>
              Exemple de texte
            </h4>
            <p className="mb-4" style={{ color: colors.textColor }}>
              Ceci est un exemple de texte avec les couleurs sélectionnées.
            </p>
            <button
              className="px-4 py-2 rounded-md"
              style={{ backgroundColor: colors.buttonColor, color: "#FFFFFF" }}
            >
              Bouton d'exemple
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#2DD4BF] text-white hover:bg-[#6B7280]"
          >
            {saving ? "Enregistrement..." : "Enregistrer les couleurs"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
