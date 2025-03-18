
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SuperAdminRoute from "@/components/superadmin/SuperAdminRoute";

// Lazy load pages for better performance
const IndexPage = lazy(() => import("@/pages/Index"));
const MenuPage = lazy(() => import("@/pages/Menu"));
const EventsPage = lazy(() => import("@/pages/Events"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const AuthPage = lazy(() => import("@/pages/Auth"));
const AdminPage = lazy(() => import("@/pages/Admin"));
const SuperAdminPage = lazy(() => import("@/pages/SuperAdmin"));
const SuperAdminLoginPage = lazy(() => import("@/pages/SuperAdminLogin"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/superadmin" element={<SuperAdminRoute><SuperAdminPage /></SuperAdminRoute>} />
        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
