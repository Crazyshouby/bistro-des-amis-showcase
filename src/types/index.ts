export interface MenuItem {
  id: string;
  categorie: string;
  nom: string;
  description: string;
  prix: number;
  image_url?: string;
  is_vegan?: boolean;
  is_spicy?: boolean;
  is_peanut_free?: boolean;
  is_gluten_free?: boolean;
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

export interface CalendarView {
  date: Date;
  view: 'month' | 'week' | 'day';
}
