/**
 * App configuration and environment variables.
 * Use VITE_* for variables exposed to the client (Vite replaces these at build time).
 * Do not put secrets here; backend-only keys (JWT_SECRET, SMTP_PASSWORD, etc.) stay in backend .env.
 */

/** Base URL for public folder. In Vite this is import.meta.env.BASE_URL (e.g. '' or '/my-app' when deployed to subpath). */
export const publicUrl = import.meta.env.BASE_URL || '';

/** Base URL for static assets when served from Cloudinary. If set to a valid URL, getAssetUrl() returns full Cloudinary URLs. Placeholders like YOUR_CLOUD are ignored so assets load from public folder. */
const _assetsBaseRaw = import.meta.env.VITE_ASSETS_BASE || '';
export const ASSETS_BASE =
  _assetsBaseRaw &&
  !_assetsBaseRaw.includes('YOUR_CLOUD') &&
  _assetsBaseRaw.startsWith('https')
    ? _assetsBaseRaw.replace(/\/$/, '')
    : '';

/**
 * Resolve a public asset path. When VITE_ASSETS_BASE is set to a valid Cloudinary URL, returns that base + path; otherwise returns local path (publicUrl + path) so images/icons load from the public folder.
 * Use for all /images/... and other public assets.
 */
export function getAssetUrl(pathOrUrl) {
  console.log(pathOrUrl,"-----------");
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return pathOrUrl;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `${pathOrUrl}`;
  if (ASSETS_BASE) return ASSETS_BASE + p;
  return publicUrl + p;
}

/** API base URL for backend. */
export const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? '/api' : 'http://localhost:5000/api'
);

/** Backend origin (no /api). Use for redirects or non-API calls. */
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/** Razorpay key id (public key for client-side checkout). */
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

/** Cloudinary cloud name for client-side uploads or media URLs. */
export const CLOUDINARY_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';

/** Optional upload preset for unsigned uploads. */
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

/** WhatsApp number with country code, digits only (e.g. 919876543210). Used for wa.me links. */
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';

/** Site name for titles and branding. */
export const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'Best of IDS';

/** Admin base path (e.g. /admin). */
export const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/admin';

export const config = {
  apiUrl: API_URL,
  appName: import.meta.env.VITE_APP_NAME || SITE_NAME,
  backendUrl: BACKEND_URL,
  razorpayKey: RAZORPAY_KEY,
  cloudinaryName: CLOUDINARY_NAME,
  cloudinaryUploadPreset: CLOUDINARY_UPLOAD_PRESET,
  whatsappNumber: WHATSAPP_NUMBER,
  siteName: SITE_NAME,
  adminPath: ADMIN_PATH,
};
