
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

export const SuperAdminRoute = ({ children }: SuperAdminRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const token = localStorage.getItem('superadmin_token');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        const parsedToken = JSON.parse(token);
        
        // Check if token exists and role is super_admin
        if (parsedToken && parsedToken.role === 'super_admin') {
          // Check if token is expired (24 hours)
          const now = Date.now();
          const tokenTime = parsedToken.timestamp;
          const tokenAgeInHours = (now - tokenTime) / (1000 * 60 * 60);
          
          if (tokenAgeInHours < 24) {
            setIsAuthenticated(true);
          } else {
            // Token expired
            localStorage.removeItem('superadmin_token');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking super admin authentication:", error);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5E7EB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2DD4BF]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return <>{children}</>;
};
