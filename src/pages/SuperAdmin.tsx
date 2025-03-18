
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
          <div className="bg-white p-4 rounded-md border border-[#6B7280] mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#E5E7EB]">
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white"
              >
                Contenu
              </TabsTrigger>
              <TabsTrigger 
                value="colors" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white"
              >
                Couleurs
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white"
              >
                Fonctionnalités
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="data-[state=active]:bg-[#2DD4BF] data-[state=active]:text-white"
              >
                Configuration
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content">
            <ContentSettings />
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

        <Card className="mt-8 border border-[#6B7280] p-4 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardDescription className="text-[#374151]">
              Enregistrez toutes les modifications en une seule fois.
            </CardDescription>
            <Button 
              onClick={handleSaveAll}
              className="bg-[#2DD4BF] text-white hover:bg-[#6B7280] px-8"
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
