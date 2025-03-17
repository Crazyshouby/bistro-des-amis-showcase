
import * as z from "zod";

export const eventSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  image_url: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

export const defaultFormValues: EventFormValues = {
  date: "",
  titre: "",
  description: "",
  image_url: "",
};
