
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Open Graph and Twitter Card metadata for better social sharing
document.head.innerHTML += `
  <meta property="og:site_name" content="Bistro des Amis" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png" />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="/lovable-uploads/3879cbc3-d347-45e2-b93d-53a58b78ba5a.png" />
`;

createRoot(document.getElementById("root")!).render(<App />);
