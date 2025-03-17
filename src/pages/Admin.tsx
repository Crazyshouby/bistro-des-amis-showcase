import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Pencil, PlusCircle, Save, Trash, LogOut, Upload, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { MenuItem, Event, CalendarView } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import MenuCalendar from "@/components/shared/MenuCalendar";

const menuItemSchema = z.object({
  id: z.string().optional(),
  categorie: z.string().min(1, "La catégorie est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  prix: z.coerce.number().min(0, "Le prix doit être positif"),
  image_url: z.string().optional()
});

const eventSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  image_url: z.string().optional(),
});

const Admin = () => {
  const { signOut, user } = useAuth();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [selectedMenuImage, setSelectedMenuImage] = useState<File | null>(null);
  const [menuImagePreview, setMenuImagePreview] = useState<string | null>(null);
  const [uploadingMenuImage, setUploadingMenuImage] = useState(false);
  
  const [menuView, setMenuView] = useState<'list' | 'calendar'>('list');
  const [selectedMenuDate, setSelectedMenuDate] = useState<Date>(new Date());

  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'menu' | 'event', id: string} | null>(null);
  
  const menuItemForm = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      categorie: "Apéritifs",
      nom: "",
      description: "",
      prix: 0,
      image_url: ""
    }
  });
  
  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: "",
      titre: "",
      description: "",
      image_url: "",
    }
  });

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
  
  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    menuItemForm.reset({
      id: item.id,
      categorie: item.categorie,
      nom: item.nom,
      description: item.description,
      prix: item.prix,
      image_url: item.image_url || ""
    });
    
    if (item.image_url) {
      setMenuImagePreview(item.image_url);
    } else {
      setMenuImagePreview(null);
    }
    
    setSelectedMenuImage(null);
    setIsMenuItemDialogOpen(true);
  };
  
  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    menuItemForm.reset({
      categorie: "Apéritifs",
      nom: "",
      description: "",
      prix: 0,
      image_url: ""
    });
    setSelectedMenuImage(null);
    setMenuImagePreview(null);
    setIsMenuItemDialogOpen(true);
  };
  
  const handleSaveMenuItem = async (data: z.infer<typeof menuItemSchema>) => {
    try {
      let imageUrl = data.image_url || null;
      
      if (selectedMenuImage) {
        const uploadedUrl = await uploadMenuImage(selectedMenuImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      if (editingMenuItem) {
        if (!imageUrl && editingMenuItem.image_url) {
          const oldImagePath = editingMenuItem.image_url.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('event_images')
              .remove([oldImagePath]);
          }
        }
        
        const { error } = await supabase
          .from('menu_items')
          .update({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMenuItem.id);
        
        if (error) throw error;
        
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item.id === editingMenuItem.id ? {
              ...item,
              categorie: data.categorie,
              nom: data.nom,
              description: data.description,
              prix: data.prix,
              image_url: imageUrl
            } : item
          )
        );
        
        toast({
          title: "Item mis à jour",
          description: `"${data.nom}" a été mis à jour avec succès.`,
        });
      } else {
        const { data: newItem, error } = await supabase
          .from('menu_items')
          .insert({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            image_url: imageUrl
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setMenuItems(prevItems => [...prevItems, newItem as MenuItem]);
        
        toast({
          title: "Item ajouté",
          description: `"${data.nom}" a été ajouté au menu.`,
        });
      }
      
      setSelectedMenuImage(null);
      setMenuImagePreview(null);
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
  
  const handleMenuImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedMenuImage(file);
      setMenuImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveMenuImage = () => {
    setSelectedMenuImage(null);
    setMenuImagePreview(null);
    if (editingMenuItem && editingMenuItem.image_url) {
      menuItemForm.setValue('image_url', '');
    }
  };
  
  const uploadMenuImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingMenuImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `menu_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('event_images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('event_images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'upload de l'image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingMenuImage(false);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (editingEvent && editingEvent.image_url) {
      eventForm.setValue('image_url', '');
    }
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('event_images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('event_images')
        .getPublicUrl(fileName);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'upload de l'image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    eventForm.reset({
      id: event.id,
      date: event.date,
      titre: event.titre,
      description: event.description,
      image_url: event.image_url || '',
    });
    
    if (event.image_url) {
      setImagePreview(event.image_url);
    } else {
      setImagePreview(null);
    }
    
    setSelectedImage(null);
    setIsEventDialogOpen(true);
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    eventForm.reset({
      date: "",
      titre: "",
      description: "",
      image_url: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsEventDialogOpen(true);
  };
  
  const handleSaveEvent = async (data: z.infer<typeof eventSchema>) => {
    try {
      let imageUrl = data.image_url || null;
      
      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      if (editingEvent) {
        if (!imageUrl && editingEvent.image_url) {
          const oldImagePath = editingEvent.image_url.split('/').pop();
          if (oldImagePath) {
            await supabase.storage
              .from('event_images')
              .remove([oldImagePath]);
          }
        }
        
        const { error } = await supabase
          .from('events')
          .update({
            date: data.date,
            titre: data.titre,
            description: data.description,
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEvent.id);
        
        if (error) throw error;
        
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === editingEvent.id ? {
              ...event,
              date: data.date,
              titre: data.titre,
              description: data.description,
              image_url: imageUrl,
            } : event
          )
        );
        
        toast({
          title: "Événement mis à jour",
          description: `"${data.titre}" a été mis à jour avec succès.`,
        });
      } else {
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert({
            date: data.date,
            titre: data.titre,
            description: data.description,
            image_url: imageUrl,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setEvents(prevEvents => [...prevEvents, newEvent as Event]);
        
        toast({
          title: "Événement ajouté",
          description: `"${data.titre}" a été ajouté au calendrier.`,
        });
      }
      
      setSelectedImage(null);
      setImagePreview(null);
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
  
  const handleMenuDateSelect = (date: Date) => {
    setSelectedMenuDate(date);
  };
  
  const handleMenuItemSelect = (item: MenuItem) => {
    handleEditMenuItem(item);
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
              </TabsList>
              
              <TabsContent value="menu" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-2xl font-playfair text-bistro-wood">Menu</CardTitle>
                    <div className="flex gap-2">
                      <div className="flex bg-bistro-sand rounded-md p-1 mr-4">
                        <Button 
                          variant={menuView === 'list' ? 'secondary' : 'ghost'} 
                          size="sm" 
                          onClick={() => setMenuView('list')}
                          className={menuView === 'list' ? 'bg-white' : ''}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Liste
                        </Button>
                        <Button 
                          variant={menuView === 'calendar' ? 'secondary' : 'ghost'} 
                          size="sm" 
                          onClick={() => setMenuView('calendar')}
                          className={menuView === 'calendar' ? 'bg-white' : ''}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Calendrier
                        </Button>
                      </div>
                      <Button 
                        onClick={handleAddMenuItem}
                        className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {menuView === 'list' ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Prix (CAD)</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {menuItems.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
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
                                <TableCell>
                                  {item.image_url ? (
                                    <img 
                                      src={item.image_url} 
                                      alt={item.nom}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                  ) : (
                                    <span className="text-bistro-wood/50 text-sm">Aucune image</span>
                                  )}
                                </TableCell>
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
                    ) : (
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-3/4">
                          <MenuCalendar 
                            menuItems={menuItems} 
                            onSelectDate={handleMenuDateSelect}
                            onSelectItem={handleMenuItemSelect}
                          />
                        </div>
                        <div className="w-full md:w-1/4">
                          <Card className="bg-bistro-sand-light border-bistro-sand">
                            <CardHeader>
                              <CardTitle className="text-lg font-playfair text-bistro-wood">Statistiques</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-bistro-wood/70">Total des items:</span>
                                  <span className="font-medium text-bistro-wood">{menuItems.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-bistro-wood/70">Catégories:</span>
                                  <span className="font-medium text-bistro-wood">
                                    {new Set(menuItems.map(item => item.categorie)).size}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-bistro-wood/70">Prix moyen:</span>
                                  <span className="font-medium text-bistro-wood">
                                    {menuItems.length > 0 
                                      ? (menuItems.reduce((sum, item) => sum + item.prix, 0) / menuItems.length).toFixed(2)
                                      : "0.00"} CAD
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
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
                          <TableHead>Image</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              Aucun événement programmé. Cliquez sur "Ajouter un événement" pour commencer.
                            </TableCell>
                          </TableRow>
                        ) : (
                          events.map((event) => (
                            <TableRow key={event.id}>
                              <TableCell>{event.date}</TableCell>
                              <TableCell className="font-medium">{event.titre}</TableCell>
                              <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                              <TableCell>
                                {event.image_url ? (
                                  <img 
                                    src={event.image_url} 
                                    alt={event.titre}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                ) : (
                                  <span className="text-bistro-wood/50 text-sm">Aucune image</span>
                                )}
                              </TableCell>
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
              
              <div className="space-y-2">
                <FormLabel className="text-bistro-wood block">Image</FormLabel>
                
                {menuImagePreview ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={menuImagePreview} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveMenuImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-bistro-sand rounded-md p-8 text-center">
                    <Upload className="h-10 w-10 text-bistro-olive/50 mx-auto mb-4" />
                    <p className="text-bistro-wood mb-2">Cliquez pour ajouter une image</p>
                    <p className="text-bistro-wood/50 text-sm">PNG, JPG ou JPEG</p>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleMenuImageChange}
                      className="hidden"
                      id="menu-item-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                      onClick={() => document.getElementById('menu-item-image')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Sélectionner une image
                    </Button>
                  </div>
                )}
                
                <FormField
                  control={menuItemForm.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormControl>
                      <Input 
                        type="hidden" 
                        {...field} 
                      />
                    </FormControl>
                  )}
                />
              </div>
              
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
                  disabled={uploadingMenuImage}
                >
                  {uploadingMenuImage ? (
                    <>Chargement...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
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
              
              <div className="space-y-2">
                <FormLabel className="text-bistro-wood block">Image</FormLabel>
                
                {imagePreview ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-bistro-sand rounded-md p-8 text-center">
                    <Upload className="h-10 w-10 text-bistro-olive/50 mx-auto mb-4" />
                    <p className="text-bistro-wood mb-2">Cliquez pour ajouter une image</p>
                    <p className="text-bistro-wood/50 text-sm">PNG, JPG ou JPEG</p>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="event-image"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 border-bistro-olive text-bistro-olive hover:bg-bistro-olive hover:text-white"
                      onClick={() => document.getElementById('event-image')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Sélectionner une image
                    </Button>
                  </div>
                )}
                
                <FormField
                  control={eventForm.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormControl>
                      <Input 
                        type="hidden" 
                        {...field} 
                      />
                    </FormControl>
                  )}
                />
              </div>
              
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
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <>Chargement...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
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
