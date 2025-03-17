
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./components/auth/AuthProvider";
import { loadGlobalColors } from "./components/superadmin/colors/colorLoader";

// Create a client
const queryClient = new QueryClient();

// Load global colors on application startup
loadGlobalColors();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
