
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Event, MenuItem } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "./AdminHeader";
import { AdminTabs } from "./AdminTabs";
import { MenuTab } from "./MenuTab";
import { EventsTab } from "./EventsTab";
import { AccountTab } from "./AccountTab";
import { CustomizationTab } from "./CustomizationTab";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminContentProps {
  user: User | null;
  signOut: () => Promise<void>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  isLoading: boolean;
}

export const AdminContent = ({ 
  user, 
  signOut, 
  menuItems, 
  setMenuItems, 
  events, 
  setEvents,
  isLoading 
}: AdminContentProps) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'menu' | 'event', id: string} | null>(null);
  const isMobile = useIsMobile();

  const confirmDeleteItem = (type: 'menu' | 'event', id: string) => {
    setItemToDelete({ type, id });
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'menu') {
        const menuItemToDelete = menuItems.find(e => e.id === itemToDelete.id);
        
        if (menuItemToDelete?.image_url) {
          const imagePath = menuItemToDelete.image_url.split('/').pop();
          if (imagePath) {
            const { error: storageError } = await supabase.storage
              .from('event_images')
              .remove([imagePath]);
              
            if (storageError) {
              console.error('Error deleting image:', storageError);
            }
          }
        }
        
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        setMenuItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        
        toast({
          title: "Item supprimé",
          description: "L'item a été supprimé du menu.",
        });
      } else {
        const eventToDelete = events.find(e => e.id === itemToDelete.id);
        
        if (eventToDelete?.image_url) {
          const imagePath = eventToDelete.image_url.split('/').pop();
          if (imagePath) {
            const { error: storageError } = await supabase.storage
              .from('event_images')
              .remove([imagePath]);
              
            if (storageError) {
              console.error('Error deleting image:', storageError);
            }
          }
        }
        
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        setEvents(prevEvents => prevEvents.filter(event => event.id !== itemToDelete.id));
        
        toast({
          title: "Événement supprimé",
          description: "L'événement a été supprimé du calendrier.",
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-bistro-wood">Chargement des données...</p>
      </div>
    );
  }

  const tabs = [
    {
      id: "menu",
      label: "Menu",
      content: (
        <MenuTab 
          menuItems={menuItems} 
          setMenuItems={setMenuItems} 
          onDeleteRequest={confirmDeleteItem} 
        />
      )
    },
    {
      id: "events",
      label: "Événements",
      content: (
        <EventsTab 
          events={events} 
          setEvents={setEvents} 
          onDeleteRequest={confirmDeleteItem} 
        />
      )
    },
    {
      id: "customization",
      label: "Personnalisation",
      content: <CustomizationTab />
    },
    {
      id: "account",
      label: "Compte",
      content: <AccountTab user={user} />
    }
  ];

  return (
    <>
      <AdminHeader user={user} signOut={signOut} isMobile={isMobile} />
      <AdminTabs tabs={tabs} defaultTab="menu" />
      
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        onConfirmDelete={handleDeleteItem}
        itemToDelete={itemToDelete}
      />
    </>
  );
};
