// lib/auth.ts - session token helpers (Kerry's auth layer)
import api  from "./api";

export interface SessionUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function saveSession(token: string, user: SessionUser) {
  if (typeof window === 'undefined') return; // SSR guard
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === 'undefined'){
     return null; // SSR guard
  }
  return localStorage.getItem('token');
}

export function getUser(): SessionUser | null {
  if (typeof window === 'undefined') {
    return null; // SSR guard
  }
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return; // SSR guard
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function validateSession(): Promise<boolean> {
  const token = getToken();

  if (!token) return false;

  try {
    await api.get('/auth/me');
    return true;
  } catch (error) {
    clearSession();
    return false;
  }
}

export function logout() {
  clearSession();
  window.location.href = '/signin';
}