
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const AdminTabs = ({ tabs, defaultTab }: AdminTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <Tabs 
      defaultValue={activeTab} 
      onValueChange={setActiveTab}
      className="w-full mt-6"
    >
      <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8">
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id}
            value={tab.id}
            className="text-sm sm:text-base"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
