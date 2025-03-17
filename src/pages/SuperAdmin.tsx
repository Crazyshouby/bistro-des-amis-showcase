
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SuperAdminTabs } from "@/components/superadmin/SuperAdminTabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ImageSettings } from "@/components/superadmin/ImageSettings";
import { ColorSettings } from "@/components/superadmin/ColorSettings";

const SuperAdmin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("images");

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
