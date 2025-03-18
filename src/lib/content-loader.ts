
import homeData from '../data/pages/home.json';
import menuData from '../data/pages/menu.json';
import eventsData from '../data/pages/events.json';
import contactData from '../data/pages/contact.json';

// Types pour les données de contenu
export interface StandardPageData {
  type: 'standard';
  title: string;
  content: string;
  styling: {
    h1Color: string;
    h2Color: string;
    backgroundColor?: string;
    accentColor?: string;
  };
  hero?: {
    imageUrl: string;
    heading: string;
    subheading: string;
  };
  gallery?: Array<{
    imageUrl: string;
    alt: string;
  }>;
  cta?: {
    text: string;
    description: string;
    backgroundImage: string;
    buttons: Array<{
      text: string;
      url: string;
    }>;
  };
  bannerImage?: string;
  contactInfo?: {
    address: string;
    phone: string;
    email: string;
    hours: string[];
  };
  mapLocation?: {
    lat: number;
    lng: number;
    zoom: number;
  };
}

export interface MenuPageData {
  type: 'menu';
  title: string;
  description: string;
  styling: {
    h1Color: string;
    h2Color: string;
    backgroundColor?: string;
    accentColor?: string;
  };
  bannerImage: string;
  filterCategories: string[];
  defaultCategory: string;
}

export type PageData = StandardPageData | MenuPageData;

interface PageDataMap {
  [key: string]: PageData;
}

// Tous les fichiers JSON chargés
const pageDataMap: PageDataMap = {
  home: homeData as PageData,
  menu: menuData as PageData,
  events: eventsData as PageData,
  contact: contactData as PageData
};

/**
 * Récupère les données de page par son nom
 */
export function getPageData(pageName: string): PageData | null {
  return pageDataMap[pageName] || null;
}

/**
 * Vérifie si les données sont de type standard
 */
export function isStandardPage(data: PageData): data is StandardPageData {
  return data.type === 'standard';
}

/**
 * Vérifie si les données sont de type menu
 */
export function isMenuPage(data: PageData): data is MenuPageData {
  return data.type === 'menu';
}
