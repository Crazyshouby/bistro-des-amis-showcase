
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { EventImageUpload } from "./EventImageUpload";
import { Event } from "@/types";
import { eventSchema, EventFormValues, defaultFormValues } from "./eventSchema";

interface EventFormProps {
  editingEvent: Event | null;
  onSubmit: (data: EventFormValues, selectedImage: File | null) => Promise<void>;
  onCancel: () => void;
  uploadingImage: boolean;
  uploadProgress?: number;
}

export const EventForm = ({
  editingEvent,
  onSubmit,
  onCancel,
  uploadingImage,
  uploadProgress = 0
}: EventFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: defaultFormValues
  });

  useEffect(() => {
    if (editingEvent) {
      form.reset({
        id: editingEvent.id,
        date: editingEvent.date,
        titre: editingEvent.titre,
        description: editingEvent.description,
        image_url: editingEvent.image_url || "",
      });
      
      if (editingEvent.image_url) {
        setImagePreview(editingEvent.image_url);
      } else {
        setImagePreview(null);
      }
    } else {
      form.reset(defaultFormValues);
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [editingEvent, form]);

  const handleImageChange = (imageFile: File | null, preview: string | null) => {
    setSelectedImage(imageFile);
    setImagePreview(preview);
    if (!imageFile && editingEvent?.image_url) {
      form.setValue('image_url', '');
    }
  };

  const handleFormSubmit = async (data: EventFormValues) => {
    await onSubmit(data, selectedImage);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
        
        <EventImageUpload 
          initialImageUrl={editingEvent?.image_url || null}
          onImageChange={handleImageChange}
          uploadingImage={uploadingImage}
          uploadProgress={uploadProgress}
        />
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
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
  );
};
