
import { FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { MenuItemFormValues } from "./menuItemSchema";

interface DietaryOptionsProps {
  form: UseFormReturn<MenuItemFormValues>;
}

export const DietaryOptions = ({ form }: DietaryOptionsProps) => {
  return (
    <div className="space-y-4">
      <FormLabel>Options alimentaires</FormLabel>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="is_vegan"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Végétalien
              </FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_spicy"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Épicé
              </FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_peanut_free"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Sans cacahuètes
              </FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="is_gluten_free"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Sans gluten
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
