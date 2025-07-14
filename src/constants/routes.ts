export const ROUTES = {
  // Public routes
  HOME: '/',
  MARKET: '/market',
  MEAT_SHOP: '/meat-shop',
  FARMERS: '/farmers',
  DAIRY: '/dairy',
  VET: '/vet',
  FEED: '/feed',
  NEWS: '/news',
  CONTACT: '/contact',
  PREMIUM: '/premium',
  
  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  MY_LISTINGS: '/my-listings',
  MESSAGES: '/messages',
  FAVORITES: '/favorites',
  TRANSACTIONS: '/transactions',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_CONTENT: '/admin/content',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_REPORTS: '/admin/reports',
  
  // API routes
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile',
      CHANGE_PASSWORD: '/api/auth/change-password',
      UPLOAD_AVATAR: '/api/auth/upload-avatar',
    },
    CATTLE: {
      LIST: '/api/cattle',
      CREATE: '/api/cattle',
      UPDATE: (id: string) => `/api/cattle/${id}`,
      DELETE: (id: string) => `/api/cattle/${id}`,
      MY_LISTINGS: '/api/cattle/my/listings',
    },
    PRODUCTS: {
      LIST: '/api/products',
      CREATE: '/api/products',
      UPDATE: (id: string) => `/api/products/${id}`,
      DELETE: (id: string) => `/api/products/${id}`,
      MY_PRODUCTS: '/api/products/my',
    },
    USERS: {
      FARMERS: '/api/farmers',
      VETERINARIANS: '/api/veterinarians',
      SELLERS: '/api/sellers',
    },
    NEWS: {
      LIST: '/api/news',
      CREATE: '/api/news',
      UPDATE: (id: string) => `/api/news/${id}`,
      DELETE: (id: string) => `/api/news/${id}`,
    },
    RATINGS: {
      LIST: '/api/ratings',
      CREATE: '/api/ratings',
      UPDATE: (id: string) => `/api/ratings/${id}`,
      DELETE: (id: string) => `/api/ratings/${id}`,
    },
    STATS: {
      PLATFORM: '/api/stats',
      SEARCH: '/api/stats/search',
    },
    CONTACT: {
      SEND: '/api/contact',
    },
    ADMIN: {
      USERS: '/api/admin/users',
      CATTLE: '/api/admin/cattle',
      PRODUCTS: '/api/admin/products',
      NEWS: '/api/admin/news',
      RATINGS: '/api/admin/ratings',
      STATS: '/api/admin/stats',
      DELETE_USER: (id: string) => `/api/admin/users/${id}`,
      DELETE_CATTLE: (id: string) => `/api/admin/cattle/${id}`,
      DELETE_PRODUCT: (id: string) => `/api/admin/products/${id}`,
      DELETE_NEWS: (id: string) => `/api/admin/news/${id}`,
      DELETE_RATING: (id: string) => `/api/admin/ratings/${id}`,
    },
  },
} as const;

export default ROUTES; 