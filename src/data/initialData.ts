/**
 * E-Soko Burundi - Baseline Platform Defaults
 * Toutes les données de démonstration fictives ont été supprimées.
 * La source de données unique est désormais Cloud Firestore.
 */
import {
  User,
  Shop,
  Category,
  Product,
  Order,
  Transaction,
  Review,
  AuditLog,
  PlatformSettings,
} from '../types';

export const INITIAL_SETTINGS: PlatformSettings = {
  commissionRate: 7.0, // 7% de commission plateforme par défaut
  lumicashEnabled: true,
  ecocashEnabled: true,
  officialSlogan: 'Le marché du Burundi, en un clic',
  supportPhone: '+257 22 25 00 00',
  supportEmail: 'contact@e-soko.bi',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_terroir',
    name: 'Produits Vivriers & Terroir',
    description: 'Café de Kayanza, Thé de Teza, miel de Kibira et délices locaux',
    iconName: 'Coffee',
    slug: 'produits-vivriers-terroir',
  },
  {
    id: 'cat_electro',
    name: 'Téléphonie & Électronique',
    description: 'Smartphones, accessoires, audio et matériel informatique',
    iconName: 'Smartphone',
    slug: 'telephonie-electronique',
  },
  {
    id: 'cat_mode',
    name: 'Mode & Pagnes Gitenge',
    description: 'Pagnes traditionnels, vêtements sur mesure et parures',
    iconName: 'Shirt',
    slug: 'mode-pagnes-gitenge',
  },
  {
    id: 'cat_artisanat',
    name: 'Artisanat & Vannerie (Agaseke)',
    description: 'Paniers traditionnels Agaseke, poterie et sculptures burundaises',
    iconName: 'Sparkles',
    slug: 'artisanat-vannerie',
  },
  {
    id: 'cat_beaute',
    name: 'Beauté & Soins Naturels',
    description: 'Savonnerie artisanale, huile d’avocat et beurre de karité',
    iconName: 'Heart',
    slug: 'beaute-soins-naturels',
  },
  {
    id: 'cat_maison',
    name: 'Maison & Équipement',
    description: 'Petits électroménagers et ustensiles pratiques',
    iconName: 'Home',
    slug: 'maison-equipement',
  },
];

// Aucune donnée mock utilisateur, produit, boutique ou commande
export const INITIAL_USERS: User[] = [];
export const INITIAL_SHOPS: Shop[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_LOGS: AuditLog[] = [];
