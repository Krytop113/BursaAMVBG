export const ROUTES = {
  dashboard: '/',
  products: '/products',
  categories: '/categories',
  users: '/users',
  login: '/login',
  roles: '/roles',
  transactions: '/transactions',
  qr: '/qr',
  invoice: '/invoice',
  api: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    reports: {
      recap: '/api/reports/recap',
      export: '/api/reports/export',
    }
  },
} as const;

export type Routes = typeof ROUTES;