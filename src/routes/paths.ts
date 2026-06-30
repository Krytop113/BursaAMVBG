export const ROUTES = {
  dashboard: '/',
  login: '/login',
  api: {
    login: '/api/auth',
  },
} as const;

export type Routes = typeof ROUTES;
