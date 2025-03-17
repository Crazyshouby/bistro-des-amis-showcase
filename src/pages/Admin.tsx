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

const menuItemSchema = z.object({
  id: z.string().optional(),
  categorie: z.string().min(1, "La catégorie est requise"),
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  prix: z.coerce.number().min(0, "Le prix doit être positif"),
  image_url: z.string().optional(),
  is_vegan: z.boolean().optional().default(false),
  is_spicy: z.boolean().optional().default(false),
  is_peanut_free: z.boolean().optional().default(false),
  is_gluten_free: z.boolean().optional().default(false)
});

const eventSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  image_url: z.string().optional(),
});

const profileSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  address: z.string().min(1, "L'adresse est requise"),
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
      image_url: "",
      is_vegan: false,
      is_spicy: false,
      is_peanut_free: false,
      is_gluten_free: false
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

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      phone: user?.user_metadata?.phone || "",
      email: user?.email || "",
      address: user?.user_metadata?.address || "",
    }
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user?.user_metadata?.full_name || "",
        phone: user?.user_metadata?.phone || "",
        email: user?.email || "",
        address: user?.user_metadata?.address || "",
      });
    }
  }, [user, profileForm]);

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
      image_url: item.image_url || "",
      is_vegan: item.is_vegan || false,
      is_spicy: item.is_spicy || false,
      is_peanut_free: item.is_peanut_free || false,
      is_gluten_free: item.is_gluten_free || false
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
      image_url: "",
      is_vegan: false,
      is_spicy: false,
      is_peanut_free: false,
      is_gluten_free: false
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
            is_vegan: data.is_vegan,
            is_spicy: data.is_spicy,
            is_peanut_free: data.is_peanut_free,
            is_gluten_free: data.is_gluten_free,
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
              image_url: imageUrl,
              is_vegan: data.is_vegan,
              is_spicy: data.is_spicy,
              is_peanut_free: data.is_peanut_free,
              is_gluten_free: data.is_gluten_free
            } : item
          )
        );
        
        toast({
          title: "Item mis à jour",
          description: `"${data.nom}" a été mis à jour avec succès."
        });
      } else {
        const { data: newItem, error } = await supabase
          .from('menu_items')
          .insert({
            categorie: data.categorie,
            nom: data.nom,
            description: data.description,
            prix: data.prix,
            image_url: imageUrl,
            is_vegan: data.is_vegan,
            is_spicy: data.is_spicy,
            is_peanut_free: data.is_peanut_free,
            is_gluten_free: data.is_gluten_free
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setMenuItems(prevItems => [...prevItems, newItem as MenuItem]);
        
        toast({
          title: "Item ajouté",
          description: `"${data.nom}" a été ajouté au menu."
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

  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          full_name: data.fullName,
          phone: data.phone,
          address: data.address
        }
      });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour du profil.",
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
                          <TableHead>Image</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
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
                              <TableCell className="space-x-1">
                                {item.is_vegan && <Leaf className="inline-block w-4 h-4 text-green-600" />}
                                {item.is_spicy && <Flame className="inline-block w-4 h-4 text-red-600" />}
                                {item.is_peanut_free && <NutOff className="inline-block w-4 h-4 text-amber-600" />}
                                {item.is_gluten_free && <WheatOff className="inline-block w-4 h-4 text-yellow-600" />}
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

              <TabsContent value="account" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-playfair text-bistro-wood">Informations du Compte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-bistro-wood">Nom Complet</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Nom complet" 
                                  {...field} 
                                  className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-bistro-wood">Numéro de Téléphone</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Numéro de téléphone" 
                                  {...field} 
                                  className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-bistro-wood">Adresse Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Email" 
                                  {...field} 
                                  className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-bistro-wood">Adresse</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Adresse complète" 
                                  {...field} 
                                  className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Enregistrer
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </div>
  );
};

export default Admin;
