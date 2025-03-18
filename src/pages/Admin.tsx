
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { MenuItem, Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminContent } from "@/components/admin/AdminContent";
import { useIsMobile } from "@/hooks/use-mobile"; 
import { EditModeProvider } from "@/components/edit/EditModeProvider";

const Admin = () => {
  const { signOut, user } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .order('categorie');
        
        if (menuError) {
          throw menuError;
        }
        
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .order('date');
        
        if (eventError) {
          throw eventError;
        }
        
        setMenuItems(menuData as MenuItem[]);
        setEvents(eventData as Event[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données depuis la base de données.",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <EditModeProvider>
      <AdminLayout title={isMobile ? "Administration" : "Espace Propriétaire"}>
        <AdminContent
          user={user}
          signOut={signOut}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          events={events}
          setEvents={setEvents}
          isLoading={dataLoading}
        />
      </AdminLayout>
    </EditModeProvider>
  );
};

export default Admin;
