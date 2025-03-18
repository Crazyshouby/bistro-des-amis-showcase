
import { Facebook, Instagram, Twitter, MapPin, Clock, Phone, Mail, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EditableElement } from "@/components/edit/EditableElement";

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
    <footer className="text-bistro-sand-light shadow-inner" style={{ backgroundColor: 'var(--dynamic-header-footer)' }}>
      <div className="content-container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4" style={{ color: 'var(--dynamic-background)' }}>Contact</h3>
            <div className="flex items-start space-x-2 mb-2">
              <MapPin size={18} className="mt-1 flex-shrink-0" style={{ color: 'var(--dynamic-background)' }} />
              <EditableElement id="footer-address" type="text" className="text-wrap" style={{ color: 'var(--dynamic-background)' }}>
                12 Rue Wellington, Verdun, QC H4G 1N1
              </EditableElement>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Phone size={18} className="flex-shrink-0" style={{ color: 'var(--dynamic-background)' }} />
              <EditableElement id="footer-phone" type="text" style={{ color: 'var(--dynamic-background)' }}>
                (418) 555-1234
              </EditableElement>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={18} className="flex-shrink-0" style={{ color: 'var(--dynamic-background)' }} />
              <EditableElement id="footer-email" type="text" style={{ color: 'var(--dynamic-background)' }}>
                info@bistrodesamis.com
              </EditableElement>
            </div>
          </div>
          
          {/* Opening Hours */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4" style={{ color: 'var(--dynamic-background)' }}>Horaires</h3>
            <div className="flex items-start space-x-2 mb-2">
              <Clock size={18} className="mt-1 flex-shrink-0" style={{ color: 'var(--dynamic-background)' }} />
              <div>
                <p className="mb-1">
                  <span className="font-medium" style={{ color: 'var(--dynamic-background)' }}>Lun-Ven:</span> 
                  <EditableElement id="footer-weekday-hours" type="text" className="inline ml-2" style={{ color: 'var(--dynamic-background)' }}>
                    16h-23h
                  </EditableElement>
                </p>
                <p>
                  <span className="font-medium" style={{ color: 'var(--dynamic-background)' }}>Sam-Dim:</span> 
                  <EditableElement id="footer-weekend-hours" type="text" className="inline ml-2" style={{ color: 'var(--dynamic-background)' }}>
                    11h-23h
                  </EditableElement>
                </p>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-playfair font-bold mb-4" style={{ color: 'var(--dynamic-background)' }}>Suivez-nous</h3>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: 'var(--dynamic-background)', color: 'var(--dynamic-header-footer)' }}
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
                  className="p-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: 'var(--dynamic-background)', color: 'var(--dynamic-header-footer)' }}
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
                  className="p-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: 'var(--dynamic-background)', color: 'var(--dynamic-header-footer)' }}
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
                  className="p-2 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: 'var(--dynamic-background)', color: 'var(--dynamic-header-footer)' }}
                  aria-label="YouTube"
                >
                  <Youtube size={20} />
                </a>
              )}
            </div>
            <div className="mt-6">
              <Link 
                to="/admin" 
                className="hover:text-bistro-sand-light text-sm transition-colors duration-300"
                style={{ color: 'var(--dynamic-background)', opacity: 0.7 }}
              >
                Espace propriétaire
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 text-center text-sm" style={{ borderTopColor: 'rgba(255,255,255,0.2)', borderTopWidth: '1px' }}>
          <EditableElement id="footer-copyright" type="text" style={{ color: 'var(--dynamic-background)' }}>
            &copy; {new Date().getFullYear()} Bistro des Amis. Tous droits réservés.
          </EditableElement>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
