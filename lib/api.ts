const SESSION_TOKEN_KEY = "shg_session_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}

export async function apiFetch(
  method: string,
  path: string,
  body?: unknown,
  authenticated = true,
): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";

  if (authenticated) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch("GET", path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, authenticated = true): Promise<T> {
  const res = await apiFetch("POST", path, body, authenticated);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch("PATCH", path, body);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch("PUT", path, body);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function apiDelete<T = { ok: boolean }>(path: string): Promise<T> {
  const res = await apiFetch("DELETE", path);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}
