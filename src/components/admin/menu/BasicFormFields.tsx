
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MenuItemFormValues } from "./menuItemSchema";

interface BasicFormFieldsProps {
  form: UseFormReturn<MenuItemFormValues>;
}

export const BasicFormFields = ({ form }: BasicFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="categorie"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catégorie</FormLabel>
            <FormControl>
              <select
                {...field}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Apéritifs">Apéritifs</option>
                <option value="Entrées">Entrées</option>
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
        control={form.control}
        name="nom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom</FormLabel>
            <FormControl>
              <Input placeholder="Nom de l'item" {...field} />
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
                placeholder="Description de l'item"
                {...field}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="prix"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix (CAD)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Prix"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
