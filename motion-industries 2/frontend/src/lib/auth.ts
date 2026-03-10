// lib/auth.ts - session token helpers (Kerry's auth layer)

export const saveSession = (token: string, user: object) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('mi_token', token);
  sessionStorage.setItem('mi_user', JSON.stringify(user));
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('mi_token');
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const u = sessionStorage.getItem('mi_user');
  return u ? JSON.parse(u) : null;
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('mi_token');
  sessionStorage.removeItem('mi_user');
};

export const isLoggedIn = (): boolean => {
  return !!getToken();
};
