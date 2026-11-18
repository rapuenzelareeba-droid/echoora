// Same-origin by default (works behind any host). Set VITE_API_URL at build time if the API lives elsewhere.
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
