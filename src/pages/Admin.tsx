
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Pencil, PlusCircle, Save, Trash, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { MenuItem, Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

// Schéma de validation pour un item du menu
const menuItemSchema = z.object({
  id: z.string().optional(),
  categorie: z.string().min(1, "La catégorie est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  prix: z.coerce.number().min(0, "Le prix doit être positif")
});

// Schéma de validation pour un événement
const eventSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise")
});

const Admin = () => {
  // Get auth context
  const { signOut, user } = useAuth();
  
  // États pour les données
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  // États pour l'édition
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Modales
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'menu' | 'event', id: string} | null>(null);
  
  // Formulaire de menu item
  const menuItemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categorie: "Apéritifs",
      nom: "",
      description: "",
      prix: 0
    }
  });
  
  // Formulaire d'événement
  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: "",
      titre: "",
      description: ""
    }
  });

  // Fetch menu items and events from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .order('categorie');
        
        if (menuError) {
          throw menuError;
        }
        
        // Fetch events
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .order('date');
        
        if (eventError) {
          throw eventError;
        }
        
        // Update state
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
  
  // Gestion du menu
  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    menuItemForm.reset({
      id: item.id,
      categorie: item.categorie,
      nom: item.nom,
      description: item.description,
      prix: item.prix
    });
    setIsMenuItemDialogOpen(true);
  };
  
  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    menuItemForm.reset({
      categorie: "Apéritifs",
      nom: "",
      description: "",
      prix: 0
    });
    setIsMenuItemDialogOpen(true);
  };
  
  const handleSaveMenuItem = async (data: z.infer<typeof menuItemSchema>) => {
    try {
      if (editingMenuItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMenuItem.id);
        
        if (error) throw error;
        
        // Update local state
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item.id === editingMenuItem.id ? {
              ...item,
              categorie: data.categorie,
              nom: data.nom,
              description: data.description,
              prix: data.prix
            } : item
          )
        );
        
        toast({
          title: "Item mis à jour",
          description: `"${data.nom}" a été mis à jour avec succès.`,
        });
      } else {
        // Add new item
        const { data: newItem, error } = await supabase
          .from('menu_items')
          .insert({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setMenuItems(prevItems => [...prevItems, newItem as MenuItem]);
        
        toast({
          title: "Item ajouté",
          description: `"${data.nom}" a été ajouté au menu.`,
        });
      }
      setIsMenuItemDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'item.",
        variant: "destructive",
      });
    }
  };
  
  const confirmDeleteItem = (type: 'menu' | 'event', id: string) => {
    setItemToDelete({ type, id });
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'menu') {
        // Delete menu item
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        // Update local state
        setMenuItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
        
        toast({
          title: "Item supprimé",
          description: "L'item a été supprimé du menu.",
        });
      } else {
        // Delete event
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', itemToDelete.id);
        
        if (error) throw error;
        
        // Update local state
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
  
  // Gestion des événements
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    eventForm.reset({
      id: event.id,
      date: event.date,
      titre: event.titre,
      description: event.description
    });
    setIsEventDialogOpen(true);
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    eventForm.reset({
      date: "",
      titre: "",
      description: ""
    });
    setIsEventDialogOpen(true);
  };
  
  const handleSaveEvent = async (data: z.infer<typeof eventSchema>) => {
    try {
      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update({
            date: data.date,
            titre: data.titre,
            description: data.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id);
        
        if (error) throw error;
        
        // Update local state
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === editingEvent.id ? {
              ...event,
              date: data.date,
              titre: data.titre,
              description: data.description
            } : event
          )
        );
        
        toast({
          title: "Événement mis à jour",
          description: `"${data.titre}" a été mis à jour avec succès.`,
        });
      } else {
        // Add new event
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert({
            date: data.date,
            titre: data.titre,
            description: data.description
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setEvents(prevEvents => [...prevEvents, newEvent as Event]);
        
        toast({
          title: "Événement ajouté",
          description: `"${data.titre}" a été ajouté au calendrier.`,
        });
      }
      setIsEventDialogOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'événement.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-texture">
      {/* Banner */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/lovable-uploads/17ae501f-c21a-4f1e-964e-ffdff257c0cb.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white">Espace Propriétaire</h1>
        </div>
      </div>
      
      {/* Admin Content */}
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
              </TabsList>
              
              {/* Menu Management */}
              <TabsContent value="menu" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-playfair text-bistro-wood">Menu</CardTitle>
                    <Button 
                      onClick={handleAddMenuItem}
                      className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un item
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Catégorie</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Prix (CAD)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              Aucun item dans le menu. Cliquez sur "Ajouter un item" pour commencer.
                            </TableCell>
                          </TableRow>
                        ) : (
                          menuItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.categorie}</TableCell>
                              <TableCell className="font-medium">{item.nom}</TableCell>
                              <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                              <TableCell>{item.prix}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditMenuItem(item)}
                                  className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => confirmDeleteItem('menu', item.id)}
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Events Management */}
              <TabsContent value="events" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-playfair text-bistro-wood">Événements</CardTitle>
                    <Button 
                      onClick={handleAddEvent}
                      className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Ajouter un événement
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              Aucun événement programmé. Cliquez sur "Ajouter un événement" pour commencer.
                            </TableCell>
                          </TableRow>
                        ) : (
                          events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>{event.date}</TableCell>
                              <TableCell className="font-medium">{event.titre}</TableCell>
                              <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditEvent(event)}
                                  className="border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => confirmDeleteItem('event', event.id)}
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
      
      {/* Menu Item Dialog */}
      <Dialog open={isMenuItemDialogOpen} onOpenChange={setIsMenuItemDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-bistro-wood">
              {editingMenuItem ? "Modifier un item" : "Ajouter un item"}
            </DialogTitle>
          </DialogHeader>
          <Form {...menuItemForm}>
            <form onSubmit={menuItemForm.handleSubmit(handleSaveMenuItem)} className="space-y-4">
              <FormField
                control={menuItemForm.control}
                name="categorie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Catégorie</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="w-full border-bistro-sand rounded-md focus:border-bistro-olive focus:ring-bistro-olive p-2"
                      >
                        <option value="Apéritifs">Apéritifs</option>
                        <option value="Plats">Plats</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Boissons">Boissons</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={menuItemForm.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Nom</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nom de l'item" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={menuItemForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description de l'item" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={menuItemForm.control}
                name="prix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Prix (CAD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsMenuItemDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-bistro-wood">
              {editingEvent ? "Modifier un événement" : "Ajouter un événement"}
            </DialogTitle>
          </DialogHeader>
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(handleSaveEvent)} className="space-y-4">
              <FormField
                control={eventForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Date (YYYY-MM-DD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={eventForm.control}
                name="titre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Titre</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Titre de l'événement" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={eventForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-bistro-wood">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description de l'événement" 
                        {...field} 
                        className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEventDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair text-bistro-wood">Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</p>
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              onClick={handleDeleteItem}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
