
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from "@/integrations/supabase/client"

// Fonction pour mettre à jour les meta tags Open Graph
const updateOpenGraphTags = async () => {
  try {
    // Récupérer l'URL de l'image et le texte d'accueil depuis supabase
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')
      .in('key', ['home_image_url', 'home_text']);

    if (error) {
      console.error('Error fetching OG data:', error);
      return;
    }

    let ogImage = "/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png"; // Image par défaut
    
    // Mise à jour des méta tags
    if (data && data.length > 0) {
      data.forEach(item => {
        if (item.key === 'home_image_url' && item.value) {
          ogImage = item.value;
        }
      });
    }

    // Ajouter les balises Open Graph et Twitter Card
    document.head.innerHTML += `
      <meta property="og:site_name" content="Bistro des Amis" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="${ogImage}" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content="${ogImage}" />
    `;
  } catch (error) {
    console.error('Error updating OG tags:', error);
    
    // Ajouter les balises Open Graph et Twitter Card par défaut en cas d'erreur
    document.head.innerHTML += `
      <meta property="og:site_name" content="Bistro des Amis" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content="/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png" />
    `;
  }
};

// Appeler la fonction pour mettre à jour les meta tags
updateOpenGraphTags().then(() => {
  // Démarrer l'application une fois les meta tags mis à jour
  createRoot(document.getElementById("root")!).render(<App />);
});
