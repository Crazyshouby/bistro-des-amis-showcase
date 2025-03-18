
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Image, Save, Plus, Trash, Settings, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const fontOptions = [
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Playfair Display, serif", label: "Playfair Display" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
];

interface ElementStyle {
  textColor?: string;
  fontFamily?: string;
  buttonDefaultColor?: string;
  buttonHoverColor?: string;
  buttonClickColor?: string;
  text?: string;
}

interface PageElement {
  id: string;
  name: string;
  type: "text" | "button" | "title" | "paragraph";
  styles: ElementStyle;
}

interface Page {
  id: string;
  title: string;
  path: string;
  elements: PageElement[];
}

export const PageCustomization = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "home",
      title: "Accueil",
      path: "/",
      elements: [],
    },
    {
      id: "menu",
      title: "Menu",
      path: "/menu",
      elements: [],
    },
    {
      id: "events",
      title: "Événements",
      path: "/events",
      elements: [],
    },
    {
      id: "contact",
      title: "Contact",
      path: "/contact",
      elements: [],
    },
  ]);
  
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [selectedElement, setSelectedElement] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", path: "" });
  const [customMode, setCustomMode] = useState<"elements" | "pages">("elements");
  
  const [elementStyles, setElementStyles] = useState<ElementStyle>({
    textColor: "#374151",
    fontFamily: "Roboto, sans-serif",
    buttonDefaultColor: "#2DD4BF",
    buttonHoverColor: "#6B7280",
    buttonClickColor: "#25A699",
    text: "",
  });

  // Charger les éléments pour la page sélectionnée
  useEffect(() => {
    const fetchPageElements = async () => {
      try {
        setLoading(true);
        
        // Simuler le chargement des éléments depuis Supabase
        // Dans une implémentation réelle, nous ferions une requête à Supabase
        const { data, error } = await supabase
          .from('site_config')
          .select('*')
          .eq('key', `page_elements_${selectedPage}`);
          
        if (error) throw error;
        
        // Si nous avons des données, mettons à jour les éléments de la page
        if (data && data.length > 0) {
          try {
            const pageData = JSON.parse(data[0].value);
            const currentPage = pages.find(p => p.id === selectedPage);
            if (currentPage) {
              currentPage.elements = pageData.elements || [];
              setPages([...pages]);
            }
          } catch (e) {
            console.error("Erreur lors du parsing des données:", e);
          }
        }
        
        // Réinitialiser l'élément sélectionné
        setSelectedElement("");
        
      } catch (error) {
        console.error('Erreur lors du chargement des éléments:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les éléments de la page",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPageElements();
  }, [selectedPage]);
  
  // Charger les styles pour l'élément sélectionné
  useEffect(() => {
    if (!selectedElement) {
      setElementStyles({
        textColor: "#374151",
        fontFamily: "Roboto, sans-serif",
        buttonDefaultColor: "#2DD4BF",
        buttonHoverColor: "#6B7280",
        buttonClickColor: "#25A699",
        text: "",
      });
      return;
    }
    
    const page = pages.find(p => p.id === selectedPage);
    if (!page) return;
    
    const element = page.elements.find(e => e.id === selectedElement);
    if (element) {
      setElementStyles({
        textColor: element.styles.textColor || "#374151",
        fontFamily: element.styles.fontFamily || "Roboto, sans-serif",
        buttonDefaultColor: element.styles.buttonDefaultColor || "#2DD4BF",
        buttonHoverColor: element.styles.buttonHoverColor || "#6B7280",
        buttonClickColor: element.styles.buttonClickColor || "#25A699",
        text: element.styles.text || "",
      });
    }
  }, [selectedElement, selectedPage, pages]);
  
  const handleStyleChange = (property: keyof ElementStyle, value: string) => {
    setElementStyles(prev => ({
      ...prev,
      [property]: value
    }));
  };
  
  const handleSaveElementStyle = async () => {
    try {
      setSaving(true);
      
      const page = pages.find(p => p.id === selectedPage);
      if (!page) return;
      
      const elementIndex = page.elements.findIndex(e => e.id === selectedElement);
      if (elementIndex >= 0) {
        page.elements[elementIndex].styles = {
          ...page.elements[elementIndex].styles,
          ...elementStyles
        };
      }
      
      // Mise à jour dans Supabase
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key: `page_elements_${selectedPage}`, 
          value: JSON.stringify({ elements: page.elements }) 
        });
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Les styles ont été mis à jour"
      });
      
      // Mise à jour de l'état local
      setPages([...pages]);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des styles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les styles",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddElement = async () => {
    const page = pages.find(p => p.id === selectedPage);
    if (!page) return;
    
    const newElementId = `${selectedPage}-element-${page.elements.length + 1}`;
    const newElement: PageElement = {
      id: newElementId,
      name: `Élément ${page.elements.length + 1}`,
      type: "text",
      styles: {
        textColor: "#374151",
        fontFamily: "Roboto, sans-serif",
        text: "Nouveau texte",
      }
    };
    
    page.elements.push(newElement);
    setPages([...pages]);
    setSelectedElement(newElementId);
    
    // Mise à jour dans Supabase
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key: `page_elements_${selectedPage}`, 
          value: JSON.stringify({ elements: page.elements }) 
        });
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Nouvel élément ajouté"
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'élément",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteElement = async () => {
    const page = pages.find(p => p.id === selectedPage);
    if (!page) return;
    
    const elementIndex = page.elements.findIndex(e => e.id === selectedElement);
    if (elementIndex >= 0) {
      page.elements.splice(elementIndex, 1);
      
      // Mise à jour dans Supabase
      try {
        const { error } = await supabase
          .from('site_config')
          .upsert({ 
            key: `page_elements_${selectedPage}`, 
            value: JSON.stringify({ elements: page.elements }) 
          });
          
        if (error) throw error;
        
        setPages([...pages]);
        setSelectedElement("");
        
        toast({
          title: "Succès",
          description: "Élément supprimé"
        });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'élément:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'élément",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleAddPage = async () => {
    if (!newPage.title || !newPage.path) {
      toast({
        title: "Erreur",
        description: "Le titre et le chemin sont requis",
        variant: "destructive"
      });
      return;
    }
    
    // Vérifier si le chemin existe déjà
    if (pages.some(p => p.path === newPage.path)) {
      toast({
        title: "Erreur",
        description: "Ce chemin existe déjà",
        variant: "destructive"
      });
      return;
    }
    
    const pageId = newPage.path.replace(/^\//, '').replace(/\//g, '-') || 'custom';
    
    const newPageObj: Page = {
      id: pageId,
      title: newPage.title,
      path: newPage.path,
      elements: [],
    };
    
    // Ajouter la page à l'état local
    setPages([...pages, newPageObj]);
    
    // Mise à jour dans Supabase
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key: 'pages', 
          value: JSON.stringify([...pages, newPageObj].map(p => ({ id: p.id, title: p.title, path: p.path }))) 
        });
        
      if (error) throw error;
      
      // Créer une entrée vide pour les éléments de la page
      const { error: elementsError } = await supabase
        .from('site_config')
        .upsert({ 
          key: `page_elements_${pageId}`, 
          value: JSON.stringify({ elements: [] }) 
        });
        
      if (elementsError) throw elementsError;
      
      setIsAddPageOpen(false);
      setNewPage({ title: "", path: "" });
      
      toast({
        title: "Succès",
        description: "Nouvelle page ajoutée"
      });
      
      // Sélectionner la nouvelle page
      setSelectedPage(pageId);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la page:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la page",
        variant: "destructive"
      });
    }
  };
  
  const handleDeletePage = async (pageId: string) => {
    // Ne pas permettre de supprimer les pages par défaut
    if (["home", "menu", "events", "contact"].includes(pageId)) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer une page par défaut",
        variant: "destructive"
      });
      return;
    }
    
    // Supprimer la page de l'état local
    const updatedPages = pages.filter(p => p.id !== pageId);
    setPages(updatedPages);
    
    // Si la page supprimée était sélectionnée, sélectionner la première page
    if (selectedPage === pageId) {
      setSelectedPage(updatedPages[0]?.id || "");
    }
    
    // Mise à jour dans Supabase
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key: 'pages', 
          value: JSON.stringify(updatedPages.map(p => ({ id: p.id, title: p.title, path: p.path }))) 
        });
        
      if (error) throw error;
      
      // Supprimer les éléments de la page
      const { error: elementsError } = await supabase
        .from('site_config')
        .delete()
        .eq('key', `page_elements_${pageId}`);
        
      if (elementsError) throw elementsError;
      
      toast({
        title: "Succès",
        description: "Page supprimée"
      });
      
    } catch (error) {
      console.error('Erreur lors de la suppression de la page:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la page",
        variant: "destructive"
      });
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
    <Card className="border border-[#2A2A2A] bg-[#1A1F2C]">
      <CardHeader className="border-b border-[#2A2A2A]">
        <CardTitle className="text-[#E5E7EB] flex justify-between items-center">
          <span>Personnalisation des pages</span>
          <div className="flex space-x-2">
            <Tabs defaultValue={customMode} onValueChange={(v) => setCustomMode(v as "elements" | "pages")} className="w-auto">
              <TabsList className="bg-[#2A2A2A]">
                <TabsTrigger value="elements" className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-[#121218]">
                  Éléments
                </TabsTrigger>
                <TabsTrigger value="pages" className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-[#121218]">
                  Gestion des pages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {customMode === "elements" ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="w-full md:w-64">
                <Label htmlFor="pageSelect" className="text-[#E5E7EB] mb-2 block">
                  Sélectionner une page
                </Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger className="w-full bg-[#2A2A2A] border-[#3A3A3A] text-[#E5E7EB]">
                    <SelectValue placeholder="Choisir une page" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#E5E7EB]">
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddElement}
                className="bg-[#2DD4BF] text-[#121218] hover:bg-[#25A699] mt-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un élément
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-[#2A2A2A] p-4 rounded-md">
                <h3 className="text-[#E5E7EB] font-medium mb-4">Éléments de la page</h3>
                
                {pages.find(p => p.id === selectedPage)?.elements.length === 0 ? (
                  <p className="text-[#9CA3AF] text-sm">
                    Aucun élément disponible. Ajoutez-en un avec le bouton ci-dessus.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pages.find(p => p.id === selectedPage)?.elements.map((element) => (
                      <div 
                        key={element.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedElement === element.id 
                            ? 'bg-[#2DD4BF] text-[#121218]' 
                            : 'bg-[#3A3A3A] text-[#E5E7EB] hover:bg-[#4A4A4A]'
                        }`}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        <div className="font-medium">{element.name}</div>
                        <div className="text-xs opacity-80">Type: {element.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                {selectedElement ? (
                  <div className="space-y-6">
                    <h3 className="text-[#E5E7EB] font-medium">Personnalisation de l'élément</h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="textColor" className="text-[#E5E7EB]">Couleur du texte</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="color"
                              id="textColor"
                              value={elementStyles.textColor}
                              onChange={(e) => handleStyleChange('textColor', e.target.value)}
                              className="w-12 h-10 p-1 cursor-pointer bg-[#2A2A2A] border-[#3A3A3A]"
                            />
                            <Input
                              type="text"
                              value={elementStyles.textColor}
                              onChange={(e) => handleStyleChange('textColor', e.target.value)}
                              className="flex-grow bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily" className="text-[#E5E7EB]">Police du texte</Label>
                          <Select 
                            value={elementStyles.fontFamily} 
                            onValueChange={(value) => handleStyleChange('fontFamily', value)}
                          >
                            <SelectTrigger className="w-full bg-[#2A2A2A] border-[#3A3A3A] text-[#E5E7EB]">
                              <SelectValue placeholder="Choisir une police" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2A2A2A] border-[#3A3A3A] text-[#E5E7EB]">
                              {fontOptions.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {pages.find(p => p.id === selectedPage)?.elements.find(e => e.id === selectedElement)?.type === "button" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="buttonDefaultColor" className="text-[#E5E7EB]">Couleur par défaut</Label>
                            <div className="flex space-x-2">
                              <Input
                                type="color"
                                id="buttonDefaultColor"
                                value={elementStyles.buttonDefaultColor}
                                onChange={(e) => handleStyleChange('buttonDefaultColor', e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer bg-[#2A2A2A] border-[#3A3A3A]"
                              />
                              <Input
                                type="text"
                                value={elementStyles.buttonDefaultColor}
                                onChange={(e) => handleStyleChange('buttonDefaultColor', e.target.value)}
                                className="flex-grow bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="buttonHoverColor" className="text-[#E5E7EB]">Couleur au survol</Label>
                            <div className="flex space-x-2">
                              <Input
                                type="color"
                                id="buttonHoverColor"
                                value={elementStyles.buttonHoverColor}
                                onChange={(e) => handleStyleChange('buttonHoverColor', e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer bg-[#2A2A2A] border-[#3A3A3A]"
                              />
                              <Input
                                type="text"
                                value={elementStyles.buttonHoverColor}
                                onChange={(e) => handleStyleChange('buttonHoverColor', e.target.value)}
                                className="flex-grow bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="buttonClickColor" className="text-[#E5E7EB]">Couleur au clic</Label>
                            <div className="flex space-x-2">
                              <Input
                                type="color"
                                id="buttonClickColor"
                                value={elementStyles.buttonClickColor}
                                onChange={(e) => handleStyleChange('buttonClickColor', e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer bg-[#2A2A2A] border-[#3A3A3A]"
                              />
                              <Input
                                type="text"
                                value={elementStyles.buttonClickColor}
                                onChange={(e) => handleStyleChange('buttonClickColor', e.target.value)}
                                className="flex-grow bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="elementText" className="text-[#E5E7EB]">Contenu textuel</Label>
                        <Textarea
                          id="elementText"
                          value={elementStyles.text || ""}
                          onChange={(e) => handleStyleChange('text', e.target.value)}
                          className="h-24 bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                          placeholder="Entrez le texte de l'élément"
                        />
                        <p className="text-xs text-[#9CA3AF]">
                          {(elementStyles.text?.length || 0)}/500 caractères
                        </p>
                      </div>
                      
                      <div className="pt-4 flex justify-between">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                              <Trash className="h-4 w-4 mr-2" />
                              Supprimer l'élément
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#1A1F2C] border-[#2A2A2A] text-[#E5E7EB]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription className="text-[#9CA3AF]">
                                Cette action est irréversible et supprimera définitivement cet élément.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-[#2A2A2A] text-[#E5E7EB] hover:bg-[#3A3A3A]">
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleDeleteElement} 
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        <Button 
                          onClick={handleSaveElementStyle} 
                          disabled={saving}
                          className="bg-[#2DD4BF] text-[#121218] hover:bg-[#25A699]"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full p-12 text-center bg-[#2A2A2A] rounded-md">
                    <Settings className="h-12 w-12 text-[#6B7280] mb-4" />
                    <h3 className="text-[#E5E7EB] font-medium text-lg mb-2">Sélectionnez un élément</h3>
                    <p className="text-[#9CA3AF] max-w-md">
                      Choisissez un élément dans la liste à gauche pour personnaliser ses propriétés, ou ajoutez un nouvel élément si la liste est vide.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h3 className="text-[#E5E7EB] font-medium">Gestion des pages du site</h3>
              
              <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2DD4BF] text-[#121218] hover:bg-[#25A699]">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une page
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1F2C] border-[#2A2A2A] text-[#E5E7EB]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle page</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle" className="text-[#E5E7EB]">Titre de la page</Label>
                      <Input
                        id="pageTitle"
                        value={newPage.title}
                        onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                        className="bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                        placeholder="Ex: À propos"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pagePath" className="text-[#E5E7EB]">Chemin de la page</Label>
                      <Input
                        id="pagePath"
                        value={newPage.path}
                        onChange={(e) => setNewPage({...newPage, path: e.target.value})}
                        className="bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A]"
                        placeholder="Ex: /about"
                      />
                      <p className="text-xs text-[#9CA3AF]">
                        Le chemin doit commencer par / et ne contenir que des lettres, chiffres et tirets.
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="bg-[#2A2A2A] text-[#E5E7EB] hover:bg-[#3A3A3A] border-[#3A3A3A]">
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button 
                      onClick={handleAddPage}
                      className="bg-[#2DD4BF] text-[#121218] hover:bg-[#25A699]"
                    >
                      Ajouter la page
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#2A2A2A] rounded-md p-4">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-[#9CA3AF] font-medium py-2">Titre</th>
                      <th className="text-left text-[#9CA3AF] font-medium py-2">Chemin</th>
                      <th className="text-left text-[#9CA3AF] font-medium py-2">ID</th>
                      <th className="text-right text-[#9CA3AF] font-medium py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.id} className="border-t border-[#3A3A3A]">
                        <td className="py-3 text-[#E5E7EB]">{page.title}</td>
                        <td className="py-3 text-[#E5E7EB]">{page.path}</td>
                        <td className="py-3 text-[#9CA3AF]">{page.id}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              onClick={() => setSelectedPage(page.id)}
                              variant="outline" 
                              size="sm"
                              className="bg-[#2A2A2A] text-[#E5E7EB] border-[#3A3A3A] hover:bg-[#3A3A3A]"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            {!["home", "menu", "events", "contact"].includes(page.id) && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="bg-[#2A2A2A] text-red-500 border-[#3A3A3A] hover:bg-[#3A3A3A]"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-[#1A1F2C] border-[#2A2A2A] text-[#E5E7EB]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Supprimer la page "{page.title}" ?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-[#9CA3AF]">
                                      Cette action est irréversible et supprimera définitivement cette page.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-[#2A2A2A] text-[#E5E7EB] hover:bg-[#3A3A3A]">
                                      Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeletePage(page.id)} 
                                      className="bg-red-600 text-white hover:bg-red-700"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 rounded-md bg-[#2A2A2A] border border-[#3A3A3A]">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] text-sm">
                      <strong className="text-[#E5E7EB]">Note :</strong> Les pages par défaut (Accueil, Menu, Événements, Contact) ne peuvent pas être supprimées. Vous pouvez uniquement personnaliser leurs éléments.
                    </p>
                    <p className="text-[#9CA3AF] text-sm mt-2">
                      Pour que les nouvelles pages soient accessibles, vous devrez ajouter des liens vers elles dans la navigation ou sur d'autres pages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
