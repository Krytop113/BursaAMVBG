export const ROUTES = {
  dashboard: '/',
  products: '/products',
  categories: '/categories',
  users: '/users',
  login: '/login',
  roles: '/roles',
  transactions: '/transactions',
  api: {
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  },
} as const;

export type Routes = typeof ROUTES;