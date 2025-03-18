
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Open Graph and Twitter Card metadata for better social sharing
document.head.innerHTML += `
  <meta property="og:site_name" content="Bistro des Amis" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/lovable-uploads/bf89ee9a-96c9-4013-9f71-93f91dbff5d5.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="/lovable-uploads/bf89ee9a-96c9-4013-9f71-93f91dbff5d5.png" />
`;

createRoot(document.getElementById("root")!).render(<App />);
