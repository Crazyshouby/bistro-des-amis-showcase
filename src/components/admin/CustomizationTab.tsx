
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorSettings } from "../customization/ColorSettings";
import { ContentSettings } from "../customization/ContentSettings";
import { HeaderSettings } from "../customization/HeaderSettings";
import { TextSettings } from "../customization/TextSettings";
import { AdvancedColorSettings } from "../customization/AdvancedColorSettings";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export const CustomizationTab = () => {
  const { isLoading } = useTheme();

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
            Personnalisez l'apparence de votre site en modifiant les couleurs et les contenus.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/" target="_blank">
            <span>Voir le site</span>
            <ExternalLink size={16} />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="advanced-colors">Couleurs avancées</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="texts">Textes</TabsTrigger>
          <TabsTrigger value="headers">Images d'en-têtes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          <ColorSettings />
        </TabsContent>
        
        <TabsContent value="advanced-colors" className="space-y-4">
          <AdvancedColorSettings />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <ContentSettings />
        </TabsContent>
        
        <TabsContent value="texts" className="space-y-4">
          <TextSettings />
        </TabsContent>
        
        <TabsContent value="headers" className="space-y-4">
          <HeaderSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
