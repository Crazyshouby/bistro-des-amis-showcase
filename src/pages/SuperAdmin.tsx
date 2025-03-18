
import { useState, useEffect } from "react";
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
import { Save, FileJson } from "lucide-react";
import { getPageData } from "@/lib/content-loader";

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("content");
  const [jsonContent, setJsonContent] = useState<{[key: string]: any}>({});

  // Charger les données JSON au démarrage
  useEffect(() => {
    const pages = ['home', 'menu', 'events', 'contact'];
    const data: {[key: string]: any} = {};
    
    pages.forEach(page => {
      const pageData = getPageData(page);
      if (pageData) {
        data[page] = pageData;
      }
    });
    
    setJsonContent(data);
  }, []);

  const handleSaveAll = () => {
    // Ici, on simulerait l'envoi des données JSON au GitHub
    console.log("Données à enregistrer:", jsonContent);
    
    toast({
      title: "Succès",
      description: "Toutes les modifications ont été enregistrées"
    });
  };

  const downloadJsonFile = () => {
    // Créer un fichier blob avec les données JSON
    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Créer un lien pour télécharger
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-content.json';
    document.body.appendChild(a);
    a.click();
    
    // Nettoyer
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Export réussi",
      description: "Les données JSON ont été exportées avec succès"
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
    },
    {
      id: "json-editor",
      label: "Éditeur JSON",
      content: (
        <div className="p-4 rounded-md border border-[#2A2A2A] bg-gray-900">
          <h2 className="text-xl font-semibold text-white mb-4">Édition des fichiers JSON</h2>
          <p className="text-gray-400 mb-6">
            Cette section vous permet de gérer le contenu dynamique du site via des fichiers JSON.
            Les modifications seront appliquées au site après reconstruction.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-md">
              <h3 className="text-white font-medium mb-2">Structure actuelle:</h3>
              <div className="bg-gray-950 p-4 rounded-md overflow-auto max-h-[500px]">
                <pre className="text-gray-300 text-sm">{JSON.stringify(jsonContent, null, 2)}</pre>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={downloadJsonFile}
                className="mr-4 bg-[#1A1F2C] border border-[#2A2A2A] text-[#2DD4BF] hover:bg-[#25A699] hover:text-white"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Exporter JSON
              </Button>
            </div>
          </div>
        </div>
      )
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
