
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface ClientConfigData {
  id: number;
  client_name: string;
  config_json: Record<string, any>; // Changed from specific shape to more generic Record type
  created_at?: string;
  updated_at?: string;
}

export const ClientConfig = () => {
  const [config, setConfig] = useState<ClientConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonString, setJsonString] = useState("");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('client_configs')
          .select('*')
          .order('id')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          // Ensure data conforms to ClientConfigData
          const configData: ClientConfigData = {
            id: data.id,
            client_name: data.client_name,
            config_json: typeof data.config_json === 'string' 
              ? JSON.parse(data.config_json) 
              : data.config_json as Record<string, any>,
            created_at: data.created_at,
            updated_at: data.updated_at
          };
          
          setConfig(configData);
          setJsonString(JSON.stringify(configData.config_json, null, 2));
        }
      } catch (error) {
        console.error('Error fetching client config:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la configuration client",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (config) {
      setConfig({ ...config, client_name: e.target.value });
    }
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
    setJsonError("");
    
    try {
      JSON.parse(e.target.value);
    } catch (err) {
      if (e.target.value.trim()) {
        setJsonError("JSON invalide. Veuillez vérifier le format.");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (jsonError) {
        toast({
          title: "Erreur",
          description: "Veuillez corriger le format JSON avant d'enregistrer",
          variant: "destructive",
        });
        return;
      }

      let configJson;
      try {
        configJson = JSON.parse(jsonString);
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Format JSON invalide",
          variant: "destructive",
        });
        return;
      }

      if (!config) {
        return;
      }

      setSaving(true);

      const { error } = await supabase
        .from('client_configs')
        .update({
          client_name: config.client_name,
          config_json: configJson
        })
        .eq('id', config.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La configuration client a été mise à jour",
      });
    } catch (error) {
      console.error('Error saving client config:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration client",
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

  if (!config) {
    return (
      <Card className="border border-[#6B7280]">
        <CardContent className="py-6">
          <p className="text-[#374151] text-center">Aucune configuration client trouvée.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#6B7280]">
      <CardHeader className="bg-[#F3F4F6] border-b border-[#6B7280]">
        <CardTitle className="text-[#374151]">Configuration client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="client-name" className="text-[#374151]">Nom du client</Label>
          <Input
            id="client-name"
            value={config.client_name}
            onChange={handleClientNameChange}
            className="border-[#6B7280]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="config-json" className="text-[#374151]">Configuration JSON</Label>
          <Textarea
            id="config-json"
            value={jsonString}
            onChange={handleJsonChange}
            className={`h-60 font-mono text-sm border-[#6B7280] ${jsonError ? 'border-red-500' : ''}`}
          />
          {jsonError && (
            <p className="text-red-500 text-sm">{jsonError}</p>
          )}
          <p className="text-[#6B7280] text-sm mt-1">
            Exemple de format: {"{ \"address\": \"123 Rue de Paris\", \"phone\": \"+33 1 23 45 67 89\" }"}
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving || !!jsonError}
            className="bg-[#2DD4BF] text-white hover:bg-[#6B7280]"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Enregistrement..." : "Enregistrer la configuration"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
