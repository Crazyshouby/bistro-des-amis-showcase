
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, Users, User, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Schéma de validation pour le formulaire de réservation
const reservationSchema = z.object({
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string({
    required_error: "Veuillez sélectionner une heure",
  }),
  people: z.coerce.number({
    required_error: "Veuillez indiquer le nombre de personnes",
  })
  .min(1, "Minimum 1 personne")
  .max(20, "Maximum 20 personnes"),
  name: z.string({
    required_error: "Veuillez entrer votre nom",
  })
  .min(2, "Votre nom doit contenir au moins 2 caractères"),
  email: z.string({
    required_error: "Veuillez entrer votre email",
  })
  .email("Veuillez entrer un email valide"),
  phone: z.string({
    required_error: "Veuillez entrer votre numéro de téléphone",
  })
  .regex(/^\+(?:[0-9] ?){6,14}[0-9]$/, "Veuillez entrer un numéro de téléphone valide (format international: +33612345678)")
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const timeSlots = [
  "12:00", "12:30", 
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
];

export default function Reservations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);
  
  const today = new Date();
  
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: today,
      people: 2,
    },
  });

  const checkCapacity = async (date: Date, time: string, people: number) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    
    try {
      // Vérifier le nombre total de personnes déjà réservées pour cette date et heure
      const { data, error } = await supabase
        .from("reservations")
        .select("people")
        .eq("date", formattedDate)
        .eq("time", time);
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Calcul du nombre total de personnes déjà réservées
      const totalPeopleBooked = data.reduce((sum, reservation) => sum + reservation.people, 0);
      
      // Vérifier si l'ajout des nouvelles personnes dépasse la capacité
      if (totalPeopleBooked + people > 20) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification de la capacité:", error);
      return false;
    }
  };

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    setCapacityError(null);
    
    try {
      // Vérifier la capacité
      const hasCapacity = await checkCapacity(data.date, data.time, data.people);
      
      if (!hasCapacity) {
        setCapacityError("Désolé, il n'y a plus de place pour cette date et cette heure. Veuillez choisir un autre créneau.");
        setIsSubmitting(false);
        return;
      }
      
      // Format de la date pour Supabase (YYYY-MM-DD)
      const formattedDate = format(data.date, "yyyy-MM-dd");
      
      // Enregistrer la réservation dans Supabase
      const { error } = await supabase
        .from("reservations")
        .insert({
          date: formattedDate,
          time: data.time,
          people: data.people,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: "pending"
        });
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Réservation réussie
      setIsSuccess(true);
      toast({
        title: "Réservation confirmée !",
        description: "Vous recevrez un email de confirmation.",
        variant: "default",
      });
      
      // Réinitialiser le formulaire
      form.reset({
        date: today,
        time: "",
        people: 2,
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réservation. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = (date: Date) => {
    // Désactiver les dates passées
    return date < new Date(today.setHours(0, 0, 0, 0));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6 text-center text-secondary">
          Réservez votre table
        </h1>
        
        {isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Réservation confirmée !</p>
              <p>Vous recevrez un email de confirmation.</p>
            </div>
          </div>
        )}
        
        {capacityError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{capacityError}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sélecteur de date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "EEEE d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={disabledDays}
                          locale={fr}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sélecteur d'heure */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une heure" />
                          <Clock className="h-4 w-4 opacity-50" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nombre de personnes */}
            <FormField
              control={form.control}
              name="people"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de personnes</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        {...field}
                        className="pl-10"
                      />
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} className="pl-10" />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type="email" className="pl-10" />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Téléphone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="+33612345678" className="pl-10" />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-bistro-olive hover:bg-bistro-olive-light text-white font-medium py-3 rounded-md"
            >
              {isSubmitting ? "Traitement en cours..." : "Réserver ma table"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
