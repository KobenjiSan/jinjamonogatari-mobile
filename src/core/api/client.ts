import { emitUnauthorized } from "../auth/authEvents";
import { getToken } from "../auth/authStorage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // --- Handle errors ---
  if (!res.ok) {
    if (res.status === 401) {
      if (token) {
        const { clearToken } = await import("../auth/authStorage");
        await clearToken();
        emitUnauthorized();

        return null;
      }
    }

    let message = `API error (${res.status})`;

    try {
      const data = await res.json();
      message = data?.detail || data?.title || message;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }

    throw new Error(message);
  }

  // --- Handle empty responses (204) ---
  if (res.status === 204) {
    return null;
  }

  // --- Handle JSON vs text safely ---
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}
