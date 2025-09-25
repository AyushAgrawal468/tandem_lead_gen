// Centralized API URL builder
// - If VITE_API_BASE is defined, use it as absolute base (e.g., https://api.example.com)
// - Otherwise, default to same-origin relative paths (works behind reverse proxies)
// Includes a tiny runtime guard to warn if a localhost base is used on a non-local host.

const normalizeBase = (base) => {
  if (!base) return '';
  try {
    // Remove trailing slash
    return base.replace(/\/$/, '');
  } catch {
    return base;
  }
};

export const getApiBase = () => {
  const envBase = import.meta?.env?.VITE_API_BASE;
  const base = normalizeBase(envBase || '');
  if (typeof window !== 'undefined' && base) {
    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(window.location.hostname);
    const isBaseLocal = /localhost|127\.0\.0\.1|\[::1\]/i.test(base);
    if (!isLocal && isBaseLocal) {
      // eslint-disable-next-line no-console
      console.warn('[API] VITE_API_BASE points to localhost while running on', window.location.origin, '->', base);
    }
  }
  return base; // '' means same-origin
};

export const apiUrl = (path) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBase();
  return base ? `${base}${p}` : p;
};
