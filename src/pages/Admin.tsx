
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Pencil, PlusCircle, Save, Trash, LogOut, Upload, X, User, Leaf, Flame, NutOff, WheatOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuItem, Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

// Import refactored components
import { MenuTab } from "@/components/admin/MenuTab";
import { EventsTab } from "@/components/admin/EventsTab";
import { AccountTab } from "@/components/admin/AccountTab";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";

const Admin = () => {
  const { signOut, user } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'menu' | 'event', id: string} | null>(null);

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

  return (
    <div className="bg-texture">
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Espace Propriétaire</h1>
        </div>
      </div>
      
      <section className="py-16 md:py-24">
        <div className="content-container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-playfair text-bistro-wood">Bienvenue, {user?.email}</h2>
            </div>
            <Button 
              onClick={signOut}
              variant="outline" 
              className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
          
          {dataLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-bistro-wood">Chargement des données...</p>
            </div>
          ) : (
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="bg-bistro-sand w-full justify-start mb-8">
                <TabsTrigger 
                  value="menu"
                  className="data-[state=active]:bg-bistro-olive data-[state=active]:text-white"
                >
                  Gestion du Menu
                </TabsTrigger>
                <TabsTrigger 
                  value="events"
                  className="data-[state=active]:bg-bistro-olive data-[state=active]:text-white"
                >
                  Gestion des Événements
                </TabsTrigger>
                <TabsTrigger 
                  value="account"
                  className="data-[state=active]:bg-bistro-olive data-[state=active]:text-white"
                >
                  Informations du Compte
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="mt-0">
                <MenuTab 
                  menuItems={menuItems} 
                  setMenuItems={setMenuItems} 
                  onDeleteRequest={confirmDeleteItem} 
                />
              </TabsContent>
              
              <TabsContent value="events" className="mt-0">
                <EventsTab 
                  events={events} 
                  setEvents={setEvents} 
                  onDeleteRequest={confirmDeleteItem} 
                />
              </TabsContent>

              <TabsContent value="account" className="mt-0">
                <AccountTab user={user} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        setIsOpen={setIsDeleteConfirmOpen}
        onConfirmDelete={handleDeleteItem}
        itemToDelete={itemToDelete}
      />
    </div>
  );
};

export default Admin;
