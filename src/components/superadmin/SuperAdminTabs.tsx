
import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface SuperAdminTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface SuperAdminTabsProps {
  tabs: SuperAdminTab[];
  defaultTab?: string;
}

export const SuperAdminTabs = ({ tabs, defaultTab }: SuperAdminTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className={`bg-bistro-brick/90 w-full ${isMobile ? 'justify-between' : 'justify-start'} mb-6 md:mb-8 py-2 h-auto`}>
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:bg-bistro-brick data-[state=active]:text-white flex-1 md:flex-none text-sm md:text-base py-1.5"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-0">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
