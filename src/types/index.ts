
export interface User {
  id: string;
  name: string;
  role: 'consumer' | 'business';
  email: string;
  password: string;
  subscriptionPlan: 'free' | 'premium';
  avatar?: string;
}

export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  name: string;
  description: string;
  type: string;
  location: string;
  coordinates: { lat: number; lng: number };
  contactEmail: string;
  contactPhone: string;
  images: string[];
  rating: number;
  reviewCount: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  category: string;
  image?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface AdSlot {
  id: string;
  businessId: string;
  type: 'sponsored' | 'banner';
  active: boolean;
  bidAmount: number;
  title: string;
  description: string;
}

export interface SearchFilters {
  location: string;
  radius: number;
  category: string;
  priceRange: [number, number];
  minRating: number;
  userLocation?: { lat: number; lng: number };
  useGpsLocation?: boolean;
}

export interface AppState {
  users: User[];
  businessProfiles: BusinessProfile[];
  products: Product[];
  messages: Message[];
  adSlots: AdSlot[];
  currentUser: User | null;
}
