
import { supabase } from "@/integrations/supabase/client";
import { applyColorsToCss, hexToRgb } from "./colorUtils";
import { ColorConfig } from "./types";

/**
 * Load colors from the database and apply them globally
 * This function should be called on application startup
 */
export const loadGlobalColors = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('type', 'color');
    
    if (error) {
      console.error('Error loading global colors:', error);
      return;
    }
    
    if (data && data.length > 0) {
      // Convert data to ColorConfig format
      const colorConfigs: ColorConfig[] = data.map(item => ({
        id: item.key,
        name: item.name,
        value: item.value,
        variable: `--bistro-${item.key}`,
        description: item.description || ""
      }));
      
      // Apply colors to CSS variables
      applyColorsToCss(colorConfigs);
    }
  } catch (error) {
    console.error('Error in loadGlobalColors:', error);
  }
};
