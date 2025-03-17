
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const eventSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  image_url: z.string().optional(),
});

interface EventDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingEvent: Event | null;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  onClose: () => void;
}

export const EventDialog = ({
  isOpen,
  setIsOpen,
  editingEvent,
  setEvents,
  onClose
}: EventDialogProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      date: "",
      titre: "",
      description: "",
      image_url: "",
    }
  });

  // Reset form when dialog opens with editing data
  useState(() => {
    if (isOpen && editingEvent) {
      form.reset({
        id: editingEvent.id,
        date: editingEvent.date,
        titre: editingEvent.titre,
        description: editingEvent.description,
        image_url: editingEvent.image_url || '',
      });
      
      if (editingEvent.image_url) {
        setImagePreview(editingEvent.image_url);
      } else {
        setImagePreview(null);
      }
    } else if (isOpen) {
      form.reset({
        date: "",
        titre: "",
        description: "",
        image_url: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
    }
  });

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
      form.setValue('image_url', '');
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

  const onSubmit = async (data: z.infer<typeof eventSchema>) => {
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
      setIsOpen(false);
      onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair">
            {editingEvent ? "Modifier un événement" : "Ajouter un événement"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date (YYYY-MM-DD)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'événement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description de l'événement"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Image</FormLabel>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center bg-gray-50">
                    <span className="text-sm text-gray-500">Aucune image</span>
                  </div>
                )}
                
                <div>
                  <Input
                    type="file"
                    id="event-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("event-image")?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingImage ? "Chargement..." : "Choisir une image"}
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-bistro-olive hover:bg-bistro-olive-light text-white"
                disabled={uploadingImage}
              >
                {editingEvent ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
