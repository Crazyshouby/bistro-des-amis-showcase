
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/components/theme/ThemeProvider";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Feature {
  id: string;
  title: string;
  description: string;
}

export const HomeSection3 = () => {
  const { textContent, colors, updateTheme } = useTheme();
  const [sectionTitle, setSectionTitle] = useState(textContent?.featuresTitle || "Ce qui nous distingue");
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "1",
      title: "Cuisine maison",
      description: "Des plats préparés avec passion à partir d'ingrédients frais et de saison."
    },
    {
      id: "2",
      title: "Ambiance chaleureuse", 
      description: "Un cadre rustique et convivial pour des moments inoubliables entre amis ou en famille."
    },
    {
      id: "3",
      title: "Tradition depuis 1930",
      description: "L'authenticité d'un bistro qui a traversé les décennies en conservant son âme."
    }
  ]);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cardBgColor, setCardBgColor] = useState(colors.featureCardBg || "#F5E9D7");
  const [cardTitleColor, setCardTitleColor] = useState(textContent?.featureTitleColor || "#4A5E3A");
  const [cardTextColor, setCardTextColor] = useState(textContent?.featureTextColor || "#3A2E1F");
  const [sectionBgColor, setSectionBgColor] = useState(colors.featuresSectionBg || "#F5E9D7");
  const [titleFont, setTitleFont] = useState(textContent?.featureTitleFont || "Playfair Display");
  const [fontOptions] = useState([
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Lato", label: "Lato" },
  ]);

  useEffect(() => {
    // Load saved features if available
    if (textContent?.features) {
      try {
        const savedFeatures = JSON.parse(textContent.features);
        if (Array.isArray(savedFeatures) && savedFeatures.length > 0) {
          setFeatures(savedFeatures);
        }
      } catch (e) {
        console.error("Erreur lors du chargement des caractéristiques:", e);
      }
    }
    
    setSectionTitle(textContent?.featuresTitle || "Ce qui nous distingue");
    setCardBgColor(colors.featureCardBg || "#F5E9D7");
    setCardTitleColor(textContent?.featureTitleColor || "#4A5E3A");
    setCardTextColor(textContent?.featureTextColor || "#3A2E1F");
    setSectionBgColor(colors.featuresSectionBg || "#F5E9D7");
    setTitleFont(textContent?.featureTitleFont || "Playfair Display");
  }, [textContent, colors]);

  const handleAddFeature = () => {
    setEditingFeature({
      id: Date.now().toString(),
      title: "",
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setIsDialogOpen(true);
  };

  const handleDeleteFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const handleSaveFeature = () => {
    if (!editingFeature) return;
    
    if (!editingFeature.title.trim() || !editingFeature.description.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et la description sont requis",
        variant: "destructive"
      });
      return;
    }
    
    const isExisting = features.some(f => f.id === editingFeature.id);
    
    if (isExisting) {
      setFeatures(features.map(f => 
        f.id === editingFeature.id ? editingFeature : f
      ));
    } else {
      setFeatures([...features, editingFeature]);
    }
    
    setIsDialogOpen(false);
    setEditingFeature(null);
  };

  const handleSaveSection = () => {
    updateTheme({
      textContent: {
        featuresTitle: sectionTitle,
        features: JSON.stringify(features),
        featureTitleColor: cardTitleColor,
        featureTextColor: cardTextColor,
        featureTitleFont: titleFont
      },
      colors: {
        featureCardBg: cardBgColor,
        featuresSectionBg: sectionBgColor
      }
    });
    
    toast({
      title: "Succès",
      description: "Les modifications ont été enregistrées"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Points Forts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="section-title">Titre de la section</Label>
                <Input 
                  id="section-title" 
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Points forts</h3>
                  <Button onClick={handleAddFeature} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {features.map((feature) => (
                    <div key={feature.id} className="border rounded-lg p-4 bg-secondary/10">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{feature.title}</h4>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditFeature(feature)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteFeature(feature.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={handleSaveSection}>
                Enregistrer les modifications
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="style" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section-bg-color">Couleur d'arrière-plan de la section</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="section-bg-color"
                        value={sectionBgColor}
                        onChange={(e) => setSectionBgColor(e.target.value)}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={sectionBgColor}
                      onChange={(e) => setSectionBgColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="card-bg-color">Couleur d'arrière-plan des cartes</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="card-bg-color"
                        value={cardBgColor}
                        onChange={(e) => setCardBgColor(e.target.value)}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={cardBgColor}
                      onChange={(e) => setCardBgColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title-font">Police des titres</Label>
                  <Select value={titleFont} onValueChange={setTitleFont}>
                    <SelectTrigger id="title-font">
                      <SelectValue placeholder="Choisir une police" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title-color">Couleur des titres</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="title-color"
                        value={cardTitleColor}
                        onChange={(e) => setCardTitleColor(e.target.value)}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={cardTitleColor}
                      onChange={(e) => setCardTitleColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="text-color">Couleur du texte</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded border">
                      <input
                        type="color"
                        id="text-color"
                        value={cardTextColor}
                        onChange={(e) => setCardTextColor(e.target.value)}
                        className="w-full h-full cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <Input 
                      value={cardTextColor}
                      onChange={(e) => setCardTextColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveSection}>
                Enregistrer les styles
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFeature && features.some(f => f.id === editingFeature.id) 
                  ? "Modifier le point fort" 
                  : "Ajouter un point fort"
                }
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="feature-title">Titre</Label>
                <Input 
                  id="feature-title" 
                  value={editingFeature?.title || ""}
                  onChange={(e) => setEditingFeature(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  placeholder="Ex: Cuisine maison"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="feature-description">Description</Label>
                <Textarea 
                  id="feature-description" 
                  value={editingFeature?.description || ""}
                  onChange={(e) => setEditingFeature(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  placeholder="Décrivez cette caractéristique en quelques mots"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleSaveFeature}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
