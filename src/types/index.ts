
export interface MenuItem {
  id: string;
  categorie: string;
  nom: string;
  description: string;
  prix: number;
}

export interface Event {
  id: string;
  date: string;
  titre: string;
  description: string;
  image_url?: string;
}

export interface ContactFormData {
  nom: string;
  email: string;
  message: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'right' | 'left' | 'down';
}

export interface ParallaxProps {
  children: React.ReactNode;
  backgroundImage: string;
  className?: string;
  overlayOpacity?: number;
  speed?: number;
}
