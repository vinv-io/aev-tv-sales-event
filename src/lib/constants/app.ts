// Application constants
export const APP_CONFIG = {
  name: 'AQUA VN Promotional Platform',
  version: '1.0.0',
  defaultLanguage: 'vi' as const,
  supportedLanguages: ['vi', 'en'] as const,
  defaultPort: 9002,
} as const;

export const ROUTES = {
  public: {
    home: '/',
    order: '/order',
    checkout: '/checkout',
    leaderboard: '/leaderboard',
    leaderboard2: '/leaderboard2',
  },
  admin: {
    root: '/admin',
    login: '/admin/login',
    dashboard: '/admin/dashboard',
    customers: '/admin/dashboard/customers',
    products: '/admin/dashboard/products',
    events: '/admin/dashboard/events',
    reports: '/admin/dashboard/reports',
    settings: '/admin/dashboard/settings',
    dataManagement: '/admin/dashboard/data-management',
  },
} as const;

export const DATABASE_CONFIG = {
  sources: {
    prisma: 'prisma',
    postgres: 'postgres',
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} as const;

export const UI_CONFIG = {
  pagination: {
    itemsPerPage: 5,
  },
  toast: {
    duration: 3000,
  },
  animation: {
    duration: 300,
  },
} as const;
