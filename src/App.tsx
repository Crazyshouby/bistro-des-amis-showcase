
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SuperAdminRoute } from "@/components/superadmin/SuperAdminRoute";
import { useEffect } from "react";
import "./App.css";

// Pages
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Admin from "@/pages/Admin";
import SuperAdmin from "@/pages/SuperAdmin";
import NotFound from "@/pages/NotFound";
import SuperAdminLogin from "@/pages/SuperAdminLogin";
import { InPlaceEditingProvider } from "@/components/customization/InPlaceEditingProvider";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <InPlaceEditingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Auth />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin"
                element={
                  <SuperAdminRoute>
                    <SuperAdmin />
                  </SuperAdminRoute>
                }
              />
              <Route path="/super-admin-login" element={<SuperAdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </InPlaceEditingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
