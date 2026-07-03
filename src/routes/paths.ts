export const ROUTES = {
  dashboard: '/',
  products: '/products',
  login: '/login',
  api: {
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  },
} as const;

export type Routes = typeof ROUTES;