
import { useState } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { SuperAdminRoute } from "@/components/superadmin/SuperAdminRoute";
import { ColorSettings } from "@/components/superadmin/ColorSettings";
import { FeaturesSettings } from "@/components/superadmin/FeaturesSettings";
import { ClientConfig } from "@/components/superadmin/ClientConfig";
import { ContentSettings } from "@/components/superadmin/ContentSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("content");

  const handleSaveAll = () => {
    toast({
      title: "Succès",
      description: "Toutes les modifications ont été enregistrées",
    });
  };

  return (
    <SuperAdminRoute>
      <SuperAdminLayout>
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-[#222222] p-4 rounded-md border border-[#333333] mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#2A2A2A]">
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-[#222222] text-gray-300"
              >
                Contenu
              </TabsTrigger>
              <TabsTrigger 
                value="colors" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-[#222222] text-gray-300"
              >
                Couleurs
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-[#222222] text-gray-300"
              >
                Fonctionnalités
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-[#222222] text-gray-300"
              >
                Configuration
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content">
            <ColorSettings />
          </TabsContent>

          <TabsContent value="colors">
            <ColorSettings />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesSettings />
          </TabsContent>

          <TabsContent value="config">
            <ClientConfig />
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border border-[#333333] p-4 bg-[#222222]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardDescription className="text-gray-400">
              Enregistrez toutes les modifications en une seule fois.
            </CardDescription>
            <Button 
              onClick={handleSaveAll}
              className="bg-[#2DD4BF] text-[#222222] hover:bg-[#25A699] hover:text-white px-8"
            >
              Enregistrer toutes les modifications
            </Button>
          </div>
        </Card>
      </SuperAdminLayout>
    </SuperAdminRoute>
  );
};

export default SuperAdmin;
