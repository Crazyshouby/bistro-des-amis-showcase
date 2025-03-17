
import * as z from "zod";

export const menuItemSchema = z.object({
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

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export const defaultFormValues: MenuItemFormValues = {
  categorie: "Apéritifs",
  nom: "",
  description: "",
  prix: 0,
  image_url: "",
  is_vegan: false,
  is_spicy: false,
  is_peanut_free: false,
  is_gluten_free: false
};
