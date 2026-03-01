import { apiFetch } from "../../core/api/client";

export type MeResult = {
  userId: number;
  email: string;
  username: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type AuthTokensResult = {
  accessToken: string;
  refreshToken: string;
};

export async function loginApi(
  identifier: string,
  password: string
): Promise<AuthTokensResult> {
  return apiFetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function registerApi(
  username: string,
  email: string,
  password: string
): Promise<AuthTokensResult> {
  return apiFetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function meApi(): Promise<MeResult> {
  return apiFetch("/api/users/me", {
    method: "GET",
  });
}

export async function refreshApi(
  refreshToken: string
): Promise<AuthTokensResult> {
  return apiFetch("/api/users/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await apiFetch("/api/users/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
