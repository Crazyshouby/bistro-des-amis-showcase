
import { Facebook, Instagram, Twitter, MapPin, Clock, Phone, Mail, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: ""
  });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        // First try to get from authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('facebook_url, instagram_url, twitter_url, youtube_url')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            setSocialLinks({
              facebook: profileData.facebook_url || "",
              instagram: profileData.instagram_url || "",
              twitter: profileData.twitter_url || "",
              youtube: profileData.youtube_url || ""
            });
            return;
          }
        }
        
        // If no user or no profile, fetch from site_settings
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('key, value')
          .eq('type', 'social');
          
        if (settingsData && settingsData.length > 0) {
          const links = {
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: ""
          };
          
          settingsData.forEach((item) => {
            if (item.key in links) {
              links[item.key as keyof typeof links] = item.value;
            }
          });
          
          setSocialLinks(links);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };
    
    fetchSocialLinks();
  }, []);

  return (
    <footer className="bg-bistro-wood text-bistro-sand-light shadow-inner">
      <div className="content-container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4">Contact</h3>
            <div className="flex items-start space-x-2 mb-2">
              <MapPin size={18} className="mt-1 flex-shrink-0" />
              <span>12 Rue Wellington, Verdun, QC H4G 1N1</span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Phone size={18} className="flex-shrink-0" />
              <span>(418) 555-1234</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={18} className="flex-shrink-0" />
              <span>info@bistrodesamis.com</span>
            </div>
          </div>
          
          {/* Opening Hours */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4">Horaires</h3>
            <div className="flex items-start space-x-2 mb-2">
              <Clock size={18} className="mt-1 flex-shrink-0" />
              <div>
                <p className="mb-1"><span className="font-medium">Lun-Ven:</span> 16h-23h</p>
                <p><span className="font-medium">Sam-Dim:</span> 11h-23h</p>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bistro-sand text-bistro-wood p-2 rounded-full hover:bg-bistro-sand-light transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              
              {socialLinks.instagram && (
                <a 
                  href={socialLinks.instagram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bistro-sand text-bistro-wood p-2 rounded-full hover:bg-bistro-sand-light transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              
              {socialLinks.twitter && (
                <a 
                  href={socialLinks.twitter}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bistro-sand text-bistro-wood p-2 rounded-full hover:bg-bistro-sand-light transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
              )}
              
              {socialLinks.youtube && (
                <a 
                  href={socialLinks.youtube}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bistro-sand text-bistro-wood p-2 rounded-full hover:bg-bistro-sand-light transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
            <div className="mt-6">
              <Link 
                to="/admin" 
                className="text-bistro-sand-light/70 hover:text-bistro-sand-light text-sm transition-colors duration-300"
              >
                Espace propriétaire
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-bistro-sand-light/20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Bistro des Amis. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
