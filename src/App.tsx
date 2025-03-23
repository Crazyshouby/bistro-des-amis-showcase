
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavigationProvider } from "./lib/hooks";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Reservations from "./pages/Reservations"; // Ajout de la page Reservations
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Footer from "./components/shared/Footer";
import Navigation from "./components/shared/Navigation";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import SuperAdmin from "./pages/SuperAdmin";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import { SuperAdminRoute } from "./components/superadmin/SuperAdminRoute";

const queryClient = new QueryClient();

// Composant qui conditionne l'affichage de la navigation et du footer
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isSuperAdminPage = location.pathname.startsWith('/superadmin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isSuperAdminPage && <Navigation />}
      <main className="flex-grow">
        {children}
      </main>
      {!isSuperAdminPage && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NavigationProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={
                  <AppLayout>
                    <Index />
                  </AppLayout>
                } />
                <Route path="/menu" element={
                  <AppLayout>
                    <Menu />
                  </AppLayout>
                } />
                <Route path="/events" element={
                  <AppLayout>
                    <Events />
                  </AppLayout>
                } />
                <Route path="/contact" element={
                  <AppLayout>
                    <Contact />
                  </AppLayout>
                } />
                <Route path="/reservations" element={
                  <AppLayout>
                    <Reservations />
                  </AppLayout>
                } />
                <Route path="/auth" element={
                  <AppLayout>
                    <Auth />
                  </AppLayout>
                } />
                <Route path="/admin" element={
                  <AppLayout>
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  </AppLayout>
                } />
                {/* SuperAdmin Routes sans navigation ni footer */}
                <Route path="/superadmin" element={
                  <SuperAdminRoute>
                    <SuperAdmin />
                  </SuperAdminRoute>
                } />
                <Route path="/superadmin/login" element={<SuperAdminLogin />} />
                <Route path="*" element={
                  <AppLayout>
                    <NotFound />
                  </AppLayout>
                } />
              </Routes>
            </ThemeProvider>
          </NavigationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
