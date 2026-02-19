export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  distance: string; // e.g., "0.5 km"
  imageUrl: string;
  isOpen: boolean;
  address?: string;
  description: string;
  reviews?: Review[];
  googleMapsUri?: string;
  openingHours?: string;
  contactNumber?: string;
  websiteUrl?: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export type Screen = 'login' | 'home' | 'detail' | 'filter' | 'search' | 'favorites' | 'profile';

export interface FilterState {
  cuisines: string[];
  priceRange: number; // 1-3
}

export type Coordinates = {
  latitude: number;
  longitude: number;
}