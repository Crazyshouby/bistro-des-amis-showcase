
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Feature {
  id: number;
  name: string;
  description: string | null;
  enabled: boolean;
}

export const FeaturesSettings = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState({ name: "", description: "", enabled: false });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('id');

        if (error) {
          throw error;
        }

        if (data) {
          setFeatures(data);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les fonctionnalités",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleFeatureToggle = (id: number, enabled: boolean) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, enabled } : feature
    ));
  };

  const handleSaveFeatures = async () => {
    setSaving(true);
    try {
      for (const feature of features) {
        const { error } = await supabase
          .from('features')
          .update({ enabled: feature.enabled })
          .eq('id', feature.id);

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Les fonctionnalités ont été mises à jour",
      });
    } catch (error) {
      console.error('Error saving features:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les fonctionnalités",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = async () => {
    try {
      if (!newFeature.name.trim()) {
        toast({
          title: "Erreur",
          description: "Le nom de la fonctionnalité est requis",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('features')
        .insert({
          name: newFeature.name.trim(),
          description: newFeature.description.trim() || null,
          enabled: newFeature.enabled
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setFeatures([...features, data[0]]);
        setNewFeature({ name: "", description: "", enabled: false });
        setIsDialogOpen(false);
        
        toast({
          title: "Succès",
          description: "La fonctionnalité a été ajoutée",
        });
      }
    } catch (error) {
      console.error('Error adding feature:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la fonctionnalité",
        variant: "destructive",
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
    <Card className="border border-[#6B7280]">
      <CardHeader className="bg-[#F3F4F6] border-b border-[#6B7280]">
        <CardTitle className="text-[#374151]">Gestion des fonctionnalités</CardTitle>
        <CardDescription className="text-[#6B7280]">
          Activez ou désactivez les fonctionnalités du site
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <Label htmlFor={`feature-${feature.id}`} className="text-[#374151] font-medium">
                  {feature.name}
                </Label>
                {feature.description && (
                  <p className="text-sm text-[#6B7280] mt-1">{feature.description}</p>
                )}
              </div>
              <Switch
                id={`feature-${feature.id}`}
                checked={feature.enabled}
                onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
              />
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-[#2DD4BF] text-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter une fonctionnalité
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-[#374151]">Ajouter une nouvelle fonctionnalité</DialogTitle>
                  <DialogDescription className="text-[#6B7280]">
                    Remplissez les informations pour ajouter une nouvelle fonctionnalité.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-name" className="text-[#374151]">Nom de la fonctionnalité</Label>
                    <Input
                      id="feature-name"
                      value={newFeature.name}
                      onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                      placeholder="Nom de la fonctionnalité"
                      className="border-[#6B7280]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feature-desc" className="text-[#374151]">Description (optionnelle)</Label>
                    <Input
                      id="feature-desc"
                      value={newFeature.description}
                      onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                      placeholder="Description de la fonctionnalité"
                      className="border-[#6B7280]"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="feature-enabled"
                      checked={newFeature.enabled}
                      onCheckedChange={(checked) => setNewFeature({ ...newFeature, enabled: checked })}
                    />
                    <Label htmlFor="feature-enabled" className="text-[#374151]">Activer la fonctionnalité</Label>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button 
                      variant="outline" 
                      className="border-[#6B7280] text-[#6B7280]"
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddFeature} 
                    className="bg-[#2DD4BF] text-white hover:bg-[#6B7280]"
                  >
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button 
              onClick={handleSaveFeatures} 
              disabled={saving}
              className="bg-[#2DD4BF] text-white hover:bg-[#6B7280]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
