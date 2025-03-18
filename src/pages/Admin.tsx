
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { MenuItem, Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminContent } from "@/components/admin/AdminContent";
import { useIsMobile } from "@/hooks/use-mobile"; 

const Admin = () => {
  const { signOut, user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const isMobile = useIsMobile();

  // Utiliser React Query pour charger les données
  const { isLoading: dataLoading } = useQuery({
    queryKey: ['adminData'],
    queryFn: async () => {
      try {
        // Charger les éléments du menu
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .order('categorie');
        
        if (menuError) throw menuError;
        
        // Charger les événements
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .order('date');
        
        if (eventError) throw eventError;
        
        // Mettre à jour les états
        setMenuItems(menuData as MenuItem[]);
        setEvents(eventData as Event[]);
        
        return { menuData, eventData };
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données depuis la base de données.",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
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
  );
};

export default Admin;
