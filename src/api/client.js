/**
 * Central API client for Best of IDs backend.
 * baseURL is set from process.env.REACT_APP_API_URL via config.
 * Attaches JWT when present.
 */
import axios from 'axios';
import { config } from '../config';

const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const AUTH_TOKEN_KEY = 'bestofids_token';
const AUTH_USER_KEY = 'bestofids_user';

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuth(token, user) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

apiClient.interceptors.request.use((req) => {
  const token = getStoredToken();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);
    if (err.response?.status === 401) {
      const hadAuthHeader = !!err.config?.headers?.Authorization;
      if (hadAuthHeader) {
        clearStoredAuth();
        if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
          window.location.href = '/login/admin';
        } else if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/signup')) {
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?redirect=${returnUrl}`;
        }
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
