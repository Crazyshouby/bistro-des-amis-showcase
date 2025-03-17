
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SuperAdminTabs } from "@/components/superadmin/SuperAdminTabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ImageSettings } from "@/components/superadmin/ImageSettings";
import { ColorSettings } from "@/components/superadmin/ColorSettings";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettingsRow {
  id: number;
  type: string;
  key: string;
  name: string;
  value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const SuperAdmin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("images");

  // Load and apply colors when the app starts
  useEffect(() => {
    const loadColors = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('type', 'color');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Apply colors to CSS variables
          data.forEach((color: SiteSettingsRow) => {
            document.documentElement.style.setProperty(`--bistro-${color.key}`, color.value);
          });
        }
      } catch (error) {
        console.error('Error loading colors:', error);
      }
    };

    loadColors();
  }, []);

  const tabs = [
    {
      id: "images",
      label: "Images Accueil",
      content: <ImageSettings />
    },
    {
      id: "colors",
      label: "Couleurs du site",
      content: <ColorSettings />
    }
  ];

  return (
    <AdminLayout title="Super Admin">
      <div className="p-4 md:p-6">
        <SuperAdminTabs tabs={tabs} defaultTab="images" />
      </div>
    </AdminLayout>
  );
};

// Wrap with ProtectedRoute to ensure only admin users can access
const ProtectedSuperAdmin = () => (
  <ProtectedRoute>
    <SuperAdmin />
  </ProtectedRoute>
);

export default ProtectedSuperAdmin;
