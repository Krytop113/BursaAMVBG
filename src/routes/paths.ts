export const ROUTES = {
  dashboard: '/',
  login: '/login',
  api: {
    login: '/api/auth/login',
  },
} as const;

export type Routes = typeof ROUTES;
