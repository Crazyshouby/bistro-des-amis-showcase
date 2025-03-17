
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Pencil, PlusCircle, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { AdminCredentials, MenuItem, Event } from "@/types";

// Schéma de validation du login
const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis")
});

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

// Données initiales pour démonstration
const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    categorie: "Apéritifs",
    nom: "Planche charcuterie/fromage",
    description: "Jambon sec, saucisson, cheddar vieilli, pain grillé artisanal.",
    prix: 18
  },
  {
    id: "2",
    categorie: "Apéritifs",
    nom: "Croquettes de camembert",
    description: "Servies avec une sauce aux canneberges maison.",
    prix: 12
  },
  {
    id: "3",
    categorie: "Plats",
    nom: "Burger du Bistro",
    description: "Pain artisanal, steak Angus, cheddar, frites maison.",
    prix: 22
  },
  {
    id: "4",
    categorie: "Plats",
    nom: "Tartine printanière",
    description: "Avocat frais, œuf poché, graines de tournesol.",
    prix: 19
  }
];

const initialEvents: Event[] = [
  {
    id: "1",
    date: "2025-03-19",
    titre: "Soirée Quiz - Culture Générale",
    description: "Lots à gagner : vin ou conso gratuite."
  },
  {
    id: "2",
    date: "2025-03-21",
    titre: "Concert acoustique - Les Étoiles Vagabondes",
    description: "Duo guitare/voix, dès 20h."
  }
];

const Admin = () => {
  // État d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour les données
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  
  // États pour l'édition
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Modales
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'menu' | 'event', id: string} | null>(null);
  
  // Formulaire de login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
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
  
  // Authentification
  const handleLogin = (data: z.infer<typeof loginSchema>) => {
    // Vérification des identifiants (dans un vrai projet, cela serait fait côté serveur)
    if (data.username === "admin" && data.password === "bistro2025") {
      setIsAuthenticated(true);
      toast({
        title: "Connecté avec succès",
        description: "Bienvenue dans l'espace propriétaire",
      });
    } else {
      toast({
        title: "Erreur d'authentification",
        description: "Identifiants incorrects",
        variant: "destructive",
      });
    }
  };
  
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
  
  const handleSaveMenuItem = (data: z.infer<typeof menuItemSchema>) => {
    if (editingMenuItem) {
      // Mise à jour d'un item existant
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === editingMenuItem.id ? { ...data, id: item.id } : item
        )
      );
      toast({
        title: "Item mis à jour",
        description: `"${data.nom}" a été mis à jour avec succès.`,
      });
    } else {
      // Ajout d'un nouvel item
      const newItem = {
        ...data,
        id: `menu-${Date.now()}`
      };
      setMenuItems(prevItems => [...prevItems, newItem]);
      toast({
        title: "Item ajouté",
        description: `"${data.nom}" a été ajouté au menu.`,
      });
    }
    setIsMenuItemDialogOpen(false);
  };
  
  const confirmDeleteItem = (type: 'menu' | 'event', id: string) => {
    setItemToDelete({ type, id });
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'menu') {
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      toast({
        title: "Item supprimé",
        description: "L'item a été supprimé du menu.",
      });
    } else {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== itemToDelete.id));
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé du calendrier.",
      });
    }
    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
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
  
  const handleSaveEvent = (data: z.infer<typeof eventSchema>) => {
    if (editingEvent) {
      // Mise à jour d'un événement existant
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === editingEvent.id ? { ...data, id: event.id } : event
        )
      );
      toast({
        title: "Événement mis à jour",
        description: `"${data.titre}" a été mis à jour avec succès.`,
      });
    } else {
      // Ajout d'un nouvel événement
      const newEvent = {
        ...data,
        id: `event-${Date.now()}`
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
      toast({
        title: "Événement ajouté",
        description: `"${data.titre}" a été ajouté au calendrier.`,
      });
    }
    setIsEventDialogOpen(false);
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
          {!isAuthenticated ? (
            // Login Form
            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-bistro-wood">Connexion</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bistro-wood">Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="admin" 
                              {...field} 
                              className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-bistro-wood">Mot de passe</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                                className="border-bistro-sand focus:border-bistro-olive focus:ring-bistro-olive pr-10"
                              />
                            </FormControl>
                            <button 
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bistro-wood/70 hover:text-bistro-wood"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-bistro-olive hover:bg-bistro-olive-light text-white"
                    >
                      Se connecter
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            // Admin Dashboard
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
                        {menuItems.map((item) => (
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
                        ))}
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
                        {events.map((event) => (
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
                        ))}
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
