import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearToken, getToken, saveToken } from "./authStorage";
import {
  loginApi,
  meApi,
  registerApi,
  MeResult,
} from "../../features/auth/authApi";
import { setOnUnauthorized } from "./authEvents";

export type AuthUser = {
  userId: number;
  email: string;
  username: string;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;

  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;

  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAuthUser(me: MeResult): AuthUser {
  return {
    userId: me.userId,
    email: me.email,
    username: me.username,
    phone: me.phone ?? null,
    firstName: me.firstName ?? null,
    lastName: me.lastName ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    const me = await meApi();
    setUser(toAuthUser(me));
  }

  // Restore session on app start
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const token = await getToken();

        if (!token) {
          if (alive) setUser(null);
          return;
        }

        // token exists, verify it by calling /me
        const me = await meApi();
        if (alive) setUser(toAuthUser(me));
      } catch {
        // token invalid/expired/etc.
        await clearToken();
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      // Silent logout
      setUser(null);
    });

    return () => setOnUnauthorized(null);
  }, []);

  async function login(identifier: string, password: string) {
    setLoading(true);
    try {
      const result: any = await loginApi(identifier, password);

      const token =
        result?.token ??
        result?.accessToken ??
        result?.jwt ??
        result?.data?.token;

      if (typeof token !== "string" || token.length === 0) {
        // console.log("LOGIN RESULT:", result);
        throw new Error("Login response did not include a valid token string.");
      }

      await saveToken(token);
      await refreshMe();
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, email: string, password: string) {
    setLoading(true);
    try {
      const result = await registerApi(username, email, password);
      const token = result.accessToken;

      if (typeof token !== "string" || token.length === 0) {
        throw new Error(
          "Register response did not include a valid token string.",
        );
      }

      await saveToken(token);
      await refreshMe();
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await clearToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshMe }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
