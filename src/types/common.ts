// Common interfaces used across the application

export interface User {
  _id: string;
  name: string;
  email: string;
  userType: 'farmer' | 'buyer' | 'veterinarian' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
  farmName?: string;
  speciality?: string;
  experience?: string;
  description?: string;
  livestock?: string;
  cattleCount?: number;
  clinicName?: string;
  specialization?: string;
  licenseNumber?: string;
  availability?: string;
  shopName?: string;

  address?: string;
  isVerified?: boolean;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cattle {
  _id: string;
  name: string;
  breed: string;
  weight: string;
  age: string;
  price: string;
  priceNumeric: number;
  type: 'Cow' | 'Bull' | 'Calf' | 'Heifer' | 'Steer';
  description: string;
  location: string;
  contact: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  seller: User;
  status: 'available' | 'sold' | 'reserved';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  priceNumeric: number;
  category: string;
  type: 'meat' | 'organ' | 'bone' | 'processed' | 'dairy' | 'feed' | 'equipment';
  halal: boolean;
  available: boolean;
  stock: number;
  unit: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  seller: User;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Health' | 'Production' | 'Technology' | 'Sustainability' | 'Market' | 'Government';
  author: string;
  image: {
    url: string;
    publicId: string;
  };
  tags: string[];
  views: number;
  readTime: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  _id: string;
  rating: number;
  comment: string;
  farmer: User;
  veterinarian: User;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceNumeric: number;
  quantity: number;
  image?: string;
  type: 'cattle' | 'product';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface FormData {
  [key: string]: string | number | boolean | File | File[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// User types
export type UserType = 'farmer' | 'buyer' | 'veterinarian' | 'seller' | 'admin';

// Cattle types
export type CattleType = 'Cow' | 'Bull' | 'Calf' | 'Heifer' | 'Steer';
export type CattleStatus = 'available' | 'sold' | 'reserved';

// Product types
export type ProductType = 'meat' | 'organ' | 'bone' | 'processed' | 'dairy' | 'feed' | 'equipment';
export type ProductCategory = 
  | 'beef' | 'mutton' | 'chicken' | 'buffalo' | 'organ' | 'bone'
  | 'dairy' | 'milk' | 'yogurt' | 'cheese' | 'butter' | 'ghee' | 'cream'
  | 'feed' | 'supplement' | 'seed' | 'equipment' | 'tool' | 'machine';

// News types
export type NewsCategory = 'Health' | 'Production' | 'Technology' | 'Sustainability' | 'Market' | 'Government';

// Sort options
export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'price_asc' 
  | 'price_desc' 
  | 'name_asc' 
  | 'name_desc' 
  | 'views' 
  | 'rating';

// Filter options
export interface FilterOptions {
  type?: string;
  category?: string;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: boolean;
  halal?: boolean;
}

// Admin stats
export interface AdminStats {
  totalUsers: number;
  totalCattle: number;
  totalProducts: number;
  totalNews: number;
  totalRatings: number;
  userTypes: {
    farmers: number;
    sellers: number;
    veterinarians: number;
    buyers: number;
  };
}

// Platform stats
export interface PlatformStats {
  totalCattle: number;
  totalFarmers: number;
  totalNews: number;
  cattleByType: Record<string, number>;
  averagePrice: number;
  topLocations: string[];
  recentListings: Cattle[];
} 