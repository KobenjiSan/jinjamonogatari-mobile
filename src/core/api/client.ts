import { emitUnauthorized } from "../auth/authEvents";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "../auth/authStorage";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE;

function isJsonContentType(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json");
}

async function parseErrorMessage(res: Response) {
  let message = `API error (${res.status})`;

  try {
    if (isJsonContentType(res)) {
      const data = await res.json();
      message = data?.detail || data?.title || message;
      return message;
    }

    const text = await res.text();
    if (text) message = text;
    return message;
  } catch {
    return message;
  }
}

/**
 * Calls POST /api/users/refresh with the stored refresh token.
 * Uses raw fetch to avoid circular dependency (authApi -> apiFetch).
 */
async function tryRefreshTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  if (!BASE_URL) throw new Error("EXPO_PUBLIC_API_BASE is not set");

  const res = await fetch(`${BASE_URL}/api/users/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as any;
  const accessToken = data?.accessToken;
  const newRefreshToken = data?.refreshToken;

  if (typeof accessToken !== "string" || accessToken.length === 0) return null;
  if (typeof newRefreshToken !== "string" || newRefreshToken.length === 0) return null;

  await saveTokens(accessToken, newRefreshToken);
  return { accessToken, refreshToken: newRefreshToken };
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  if (!BASE_URL) throw new Error("EXPO_PUBLIC_API_BASE is not set");

  // Pull current access token (may be null)
  const accessToken = await getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  // Helper to run the request (so we can retry after refresh)
  const run = async (hdrs: Record<string, string>) => {
    return await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: hdrs,
    });
  };

  let res = await run(headers);

  // If unauthorized AND we had an access token, try refresh ONCE then retry.
  if (res.status === 401 && accessToken) {
    // Never try to refresh while calling refresh itself (or auth endpoints)
    const isAuthEndpoint =
      path.includes("/api/users/refresh") ||
      path.includes("/api/users/login") ||
      path.includes("/api/users/register");

    const alreadyRetried = (options.headers as any)?.["x-refreshed-once"] === "1";

    if (!isAuthEndpoint && !alreadyRetried) {
      const refreshed = await tryRefreshTokens();

      if (refreshed) {
        const retryHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${refreshed.accessToken}`,
          // mark this request so we don't loop if refresh "works" but still 401s
          "x-refreshed-once": "1",
        };

        res = await run(retryHeaders);
      }
    }
  }

  // --- Handle errors ---
  if (!res.ok) {
    if (res.status === 401) {
      // Refresh failed or still unauthorized after retry → hard logout
      await clearTokens();
      emitUnauthorized();
      return null;
    }

    const message = await parseErrorMessage(res);
    throw new Error(message);
  }

  // --- Handle empty responses (204) ---
  if (res.status === 204) {
    return null;
  }

  // --- Handle JSON vs text safely ---
  if (isJsonContentType(res)) {
    return res.json();
  }

  return res.text();
}