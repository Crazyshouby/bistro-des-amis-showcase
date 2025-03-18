
import { useState } from "react";
import { SuperAdminLayout } from "@/components/superadmin/SuperAdminLayout";
import { SuperAdminRoute } from "@/components/superadmin/SuperAdminRoute";
import { ColorSettings } from "@/components/superadmin/ColorSettings";
import { FeaturesSettings } from "@/components/superadmin/FeaturesSettings";
import { ClientConfig } from "@/components/superadmin/ClientConfig";
import { ContentSettings } from "@/components/superadmin/ContentSettings";
import { PageCustomization } from "@/components/superadmin/PageCustomization";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("content");

  const handleSaveAll = () => {
    toast({
      title: "Succès",
      description: "Toutes les modifications ont été enregistrées"
    });
  };

  const tabs = [
    {
      id: "content",
      label: "Contenu",
      content: <ContentSettings />
    },
    {
      id: "colors",
      label: "Couleurs",
      content: <ColorSettings />
    },
    {
      id: "page-customization",
      label: "Pages",
      content: <PageCustomization />
    },
    {
      id: "features",
      label: "Fonctionnalités",
      content: <FeaturesSettings />
    },
    {
      id: "config",
      label: "Configuration",
      content: <ClientConfig />
    }
  ];

  return (
    <SuperAdminRoute>
      <SuperAdminLayout>
        <div className="space-y-6">
          <div className="p-4 rounded-md border border-[#2A2A2A] mb-6 bg-gray-900">
            <AdminTabs 
              tabs={tabs} 
              defaultTab={activeTab}
            />
          </div>
        </div>

        <Card className="mt-8 border border-[#2A2A2A] p-4 bg-[#1A1F2C]">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <CardDescription className="text-gray-400">
              Enregistrez toutes les modifications en une seule fois.
            </CardDescription>
            <Button onClick={handleSaveAll} className="bg-[#2DD4BF] text-[#121218] hover:bg-[#25A699] hover:text-white px-8">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer toutes les modifications
            </Button>
          </div>
        </Card>
      </SuperAdminLayout>
    </SuperAdminRoute>
  );
};

export default SuperAdmin;
