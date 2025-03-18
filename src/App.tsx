import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/routes";
import { EditModeProvider } from "@/components/edit/EditModeProvider";
import { EditModePopup } from "@/components/edit/EditModePopup";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <EditModeProvider>
          <AuthProvider>
            <AppRoutes />
            <EditModePopup />
            <Toaster />
          </AuthProvider>
        </EditModeProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
