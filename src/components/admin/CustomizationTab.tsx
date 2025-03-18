
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HomeSection1 } from "../customization/home/HomeSection1";
import { HomeSection2 } from "../customization/home/HomeSection2";
import { HomeSection3 } from "../customization/home/HomeSection3";
import { HomeSection4 } from "../customization/home/HomeSection4";
import { MenuCustomization } from "../customization/menu/MenuCustomization";
import { EventsCustomization } from "../customization/events/EventsCustomization";
import { ContactCustomization } from "../customization/contact/ContactCustomization";

export const CustomizationTab = () => {
  const { isLoading, refreshTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("section1");

  const handleSaveChanges = async () => {
    try {
      toast({
        title: "Succès",
        description: "Les modifications ont été sauvegardées avec succès",
      });
      await refreshTheme();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-bistro-wood">Chargement des préférences visuelles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold mb-1">Personnalisation du site</h2>
          <p className="text-muted-foreground">
            Personnalisez l'apparence de votre site en modifiant les couleurs, images et textes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSaveChanges} className="gap-2">
            Sauvegarder
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/" target="_blank">
              <span>Voir le site</span>
              <ExternalLink size={16} />
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="accueil" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="accueil">Accueil</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="evenements">Événements</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accueil" className="space-y-4">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="section1">Section Hero</TabsTrigger>
              <TabsTrigger value="section2">Section Histoire</TabsTrigger>
              <TabsTrigger value="section3">Section Points Forts</TabsTrigger>
              <TabsTrigger value="section4">Galerie Photos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="section1" className="space-y-4">
              <HomeSection1 />
            </TabsContent>
            
            <TabsContent value="section2" className="space-y-4">
              <HomeSection2 />
            </TabsContent>
            
            <TabsContent value="section3" className="space-y-4">
              <HomeSection3 />
            </TabsContent>
            
            <TabsContent value="section4" className="space-y-4">
              <HomeSection4 />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="menu" className="space-y-4">
          <MenuCustomization />
        </TabsContent>
        
        <TabsContent value="evenements" className="space-y-4">
          <EventsCustomization />
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <ContactCustomization />
        </TabsContent>
      </Tabs>
    </div>
  );
};
