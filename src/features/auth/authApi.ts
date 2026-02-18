import { apiFetch } from "../../core/api/client";

export type MeResult = {
  userId: number;
  email: string;
  username: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export type LoginResult = {
  token: string;
};

export async function loginApi(
  identifier: string,
  password: string
): Promise<LoginResult> {
  return apiFetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export type RegisterResult = {
  accessToken: string;
};

export async function registerApi(
  username: string,
  email: string,
  password: string
): Promise<RegisterResult> {
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
