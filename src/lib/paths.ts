export const ROUTES = {
  dashboard: '/',
  products: '/products',
  categories: '/categories',
  users: '/users',
  login: '/login',
  forgotPassword: '/forgot-password',
  roles: '/roles',
  transactions: '/transactions',
  qr: '/qr',
  qrCatalog: '/qr/catalog',
  invoice: '/invoice',
  api: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    forgotPassword: '/api/auth/forgot-password',
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      forgotPassword: '/api/auth/forgot-password',
    },
    products: '/api/products',
    categories: '/api/categories',
    users: '/api/user',
    roles: '/api/roles',
    transactions: '/api/transactions',
    reports: {
      recap: '/api/reports/recap',
      export: '/api/reports/export',
    },
  },
} as const;

export type Routes = typeof ROUTES;
