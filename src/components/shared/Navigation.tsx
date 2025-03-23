
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/lib/hooks";
import { useAuth } from "@/components/auth/AuthProvider";

const Navigation = () => {
  const location = useLocation();
  const { isScrolled, isOpen, setIsOpen } = useNavigation();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Force close mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Événements", path: "/events" },
    { name: "Réserver", path: "/reservations" }, // Ajout du lien de réservation
    { name: "Contact", path: "/contact" },
    // Conditionally show Admin or Auth based on auth status
    ...(user ? [{ name: "Admin", path: "/admin" }] : [{ name: "Connexion", path: "/auth" }])
  ];

  return (
    <header
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled ? "shadow-md py-2" : "bg-transparent py-4"
      )}
      style={{ 
        backgroundColor: isScrolled ? 'var(--dynamic-header-footer)' : 'transparent'
      }}
    >
      <div className="content-container">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-playfair text-2xl md:text-3xl font-bold" style={{ color: 'var(--dynamic-background)' }}>
            Bar Bistro
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-medium transition-colors",
                  location.pathname === link.path ? "text-secondary" : ""
                )}
                style={{ 
                  color: location.pathname === link.path ? '#D4A017' : 'var(--dynamic-background)'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden hover:text-secondary"
            style={{ color: 'var(--dynamic-background)' }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation - Dark background */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-3 rounded-md p-4 shadow-lg"
            style={{ backgroundColor: 'var(--dynamic-header-footer)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "font-medium transition-colors",
                  location.pathname === link.path ? "text-secondary" : ""
                )}
                style={{ 
                  color: location.pathname === link.path ? '#D4A017' : 'var(--dynamic-background)'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
