
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bistro-sand-light">
      <div className="text-center p-8 rounded-lg bg-white shadow-lg max-w-md">
        <h1 className="text-6xl font-playfair font-bold text-bistro-brick mb-6">404</h1>
        <p className="text-xl text-bistro-wood mb-4">Oups ! La page que vous recherchez n'existe pas.</p>
        <p className="text-bistro-wood/80 mb-8">Peut-être que l'adresse a changé ou que la page a été supprimée.</p>
        <Link to="/">
          <Button className="bg-bistro-olive hover:bg-bistro-olive-light text-white">
            <Home className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
