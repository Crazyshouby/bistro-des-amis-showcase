
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Define the allowed table names
type TableNames = keyof Database['public']['Tables'];

// Fonction utilitaire pour gérer les erreurs Supabase
export const handleSupabaseError = (error: any, customMessage?: string) => {
  console.error('Supabase error:', error);
  toast({
    title: "Erreur",
    description: customMessage || "Une erreur s'est produite lors de l'opération.",
    variant: "destructive",
  });
};

// Fonction utilitaire pour les requêtes de chargement de données
export const fetchData = async <T>(
  tableName: TableNames,
  query?: { 
    select?: string,
    eq?: [string, any][], 
    order?: [string, 'asc' | 'desc'][] 
  }
): Promise<T[]> => {
  try {
    let queryBuilder = supabase
      .from(tableName)
      .select(query?.select || '*');
    
    // Appliquer les filtres d'égalité s'il y en a
    if (query?.eq) {
      query.eq.forEach(([column, value]) => {
        queryBuilder = queryBuilder.eq(column, value);
      });
    }
    
    // Appliquer les ordres si spécifiés
    if (query?.order) {
      query.order.forEach(([column, direction]) => {
        queryBuilder = queryBuilder.order(column, { ascending: direction === 'asc' });
      });
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      handleSupabaseError(error, `Impossible de charger les données de ${tableName}`);
      return [];
    }
    
    return data as T[];
  } catch (error) {
    handleSupabaseError(error, `Erreur lors du chargement des données de ${tableName}`);
    return [];
  }
};

// Fonction utilitaire pour les insertions
export const insertData = async <T>(
  tableName: TableNames,
  data: any
): Promise<T | null> => {
  try {
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      handleSupabaseError(error, `Impossible d'insérer dans ${tableName}`);
      return null;
    }
    
    return insertedData as T;
  } catch (error) {
    handleSupabaseError(error, `Erreur lors de l'insertion dans ${tableName}`);
    return null;
  }
};

// Fonction utilitaire pour les mises à jour - Simplification des types pour éviter l'erreur TS2589
export const updateData = async (
  tableName: TableNames,
  id: string | number,
  data: Record<string, any>,
  idColumn: string = 'id'
): Promise<Record<string, any> | null> => {
  try {
    const { data: updatedData, error } = await supabase
      .from(tableName)
      .update(data)
      .eq(idColumn, id)
      .select();
    
    if (error) {
      handleSupabaseError(error, `Impossible de mettre à jour dans ${tableName}`);
      return null;
    }
    
    return updatedData[0] || null;
  } catch (error) {
    handleSupabaseError(error, `Erreur lors de la mise à jour dans ${tableName}`);
    return null;
  }
};

// Fonction utilitaire pour les suppressions
export const deleteData = async (
  tableName: TableNames,
  id: string | number,
  idColumn: string = 'id'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(idColumn, id);
    
    if (error) {
      handleSupabaseError(error, `Impossible de supprimer de ${tableName}`);
      return false;
    }
    
    return true;
  } catch (error) {
    handleSupabaseError(error, `Erreur lors de la suppression de ${tableName}`);
    return false;
  }
};
