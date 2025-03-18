import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
interface AdminTab {
  id: string;
  label: string;
  content: ReactNode;
}
interface AdminTabsProps {
  tabs: AdminTab[];
  defaultTab?: string;
}
export const AdminTabs = ({
  tabs,
  defaultTab
}: AdminTabsProps) => {
  const isMobile = useIsMobile();
  return <Tabs defaultValue={defaultTab || tabs[0].id} className="w-full">
      <TabsList className={`w-full ${isMobile ? 'justify-between' : 'justify-start'} mb-6 md:mb-8 py-2 h-auto`} style={{
      backgroundColor: 'var(--dynamic-background)'
    }}>
        {tabs.map(tab => <TabsTrigger key={tab.id} value={tab.id} style={{
        backgroundColor: 'var(--state=active, #4A5E3A, transparent)',
        color: 'var(--state=active, var(--dynamic-background), var(--dynamic-text))'
      }} className="flex-1 md:flex-none text-sm py-1.5 text-zinc-950 bg-orange-300 hover:bg-orange-200 rounded-lg font-medium md:text-base mx-[46px]">
            {tab.label}
          </TabsTrigger>)}
      </TabsList>
      
      {tabs.map(tab => <TabsContent key={tab.id} value={tab.id} className="mt-0">
          {tab.content}
        </TabsContent>)}
    </Tabs>;
};