import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Event } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { EventForm } from "./EventForm";
import { EventFormValues } from "./eventSchema";
import { uploadEventImage } from "./EventImageUpload";

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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (data: EventFormValues, selectedImage: File | null) => {
    try {
      if (selectedImage) {
        setUploadingImage(true);
        setUploadProgress(0);
      }
      
      let imageUrl = data.image_url || null;
      
      if (selectedImage) {
        console.log("Uploading image...");
        const uploadedUrl = await uploadEventImage(selectedImage, setUploadProgress);
        console.log("Upload result:", uploadedUrl);
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
          description: `"${data.titre}" a été mis à jour avec succès.",
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
          description: `"${data.titre}" a été ajouté au calendrier.",
        });
      }
      
      setIsOpen(false);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement de l'événement.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
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
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour {editingEvent ? "modifier" : "ajouter"} un événement.
          </DialogDescription>
        </DialogHeader>
        
        <EventForm
          editingEvent={editingEvent}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsOpen(false);
            onClose();
          }}
          uploadingImage={uploadingImage}
          uploadProgress={uploadProgress}
        />
      </DialogContent>
    </Dialog>
  );
};
