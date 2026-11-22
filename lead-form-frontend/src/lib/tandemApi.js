// Login + event APIs live on the app backend, not the landing backend behind apiUrl()
export const API = (import.meta.env.VITE_TANDEM_API_BASE || "https://api.tandem.it.com").replace(/\/$/, "");

export class AuthError extends Error {}

/** JSON call to the app backend. Errors carry the HTTP status and the response body (statusId, code, tries_left). */
export async function call(path, { token, method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401) throw new AuthError("Session expired");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.status || `Request failed (${res.status})`), { status: res.status, data });
  return data;
}
