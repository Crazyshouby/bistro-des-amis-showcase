
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/ThemeProvider";
import { HistoryImageUploader } from "./HistoryImageUploader";
import { toast } from "@/components/ui/use-toast";

export const HomeSection2 = () => {
  const { textContent, updateTheme, refreshTheme } = useTheme();
  
  const [historyTitle, setHistoryTitle] = useState(textContent.historyTitle || "");
  const [historyText, setHistoryText] = useState(textContent.historyText || "");
  const [historyText2, setHistoryText2] = useState(textContent.historyText2 || "");
  const [historyTitleColor, setHistoryTitleColor] = useState(textContent.historyTitleColor || "#3A2E1F");
  const [historyTextColor, setHistoryTextColor] = useState(textContent.historyTextColor || "#3A2E1F");
  const [historyTitleFont, setHistoryTitleFont] = useState(textContent.historyTitleFont || "Playfair Display");
  
  // Update local state when theme changes
  useEffect(() => {
    setHistoryTitle(textContent.historyTitle || "");
    setHistoryText(textContent.historyText || "");
    setHistoryText2(textContent.historyText2 || "");
    setHistoryTitleColor(textContent.historyTitleColor || "#3A2E1F");
    setHistoryTextColor(textContent.historyTextColor || "#3A2E1F");
    setHistoryTitleFont(textContent.historyTitleFont || "Playfair Display");
  }, [textContent]);
  
  const handleSave = async () => {
    try {
      await updateTheme({
        textContent: {
          historyTitle,
          historyText,
          historyText2,
          historyTitleColor,
          historyTextColor,
          historyTitleFont
        }
      });
      
      // Refresh theme after update to ensure all components have latest data
      await refreshTheme();
      
      toast({
        title: "Succès",
        description: "Les modifications ont été enregistrées"
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur", 
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section "Notre Histoire"</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="history-title">Titre de la section</Label>
            <Input 
              id="history-title" 
              value={historyTitle} 
              onChange={(e) => setHistoryTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="history-text">Texte principal</Label>
            <Textarea 
              id="history-text" 
              value={historyText} 
              onChange={(e) => setHistoryText(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="history-text-2">Texte secondaire</Label>
            <Textarea 
              id="history-text-2" 
              value={historyText2} 
              onChange={(e) => setHistoryText2(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="history-title-color">Couleur du titre</Label>
              <div className="flex">
                <Input 
                  id="history-title-color"
                  type="color"
                  value={historyTitleColor} 
                  onChange={(e) => setHistoryTitleColor(e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input 
                  type="text"
                  value={historyTitleColor}
                  onChange={(e) => setHistoryTitleColor(e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="history-text-color">Couleur du texte</Label>
              <div className="flex">
                <Input 
                  id="history-text-color"
                  type="color"
                  value={historyTextColor} 
                  onChange={(e) => setHistoryTextColor(e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input 
                  type="text"
                  value={historyTextColor}
                  onChange={(e) => setHistoryTextColor(e.target.value)}
                  className="flex-1 ml-2"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="history-title-font">Police du titre</Label>
              <select
                id="history-title-font"
                value={historyTitleFont}
                onChange={(e) => setHistoryTitleFont(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Lora">Lora</option>
                <option value="Roboto Slab">Roboto Slab</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Image de la section</h3>
            <HistoryImageUploader />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Enregistrer les changements
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
