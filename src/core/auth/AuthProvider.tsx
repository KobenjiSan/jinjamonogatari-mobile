import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./authStorage";
import {
  loginApi,
  logoutApi,
  meApi,
  refreshApi,
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
  loading: boolean;   // true while login/register/refreshMe in-flight
  authReady: boolean; // true after startup restore attempt finishes

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
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  async function refreshMe() {
    setLoading(true);
    try {
      const me = await meApi();
      setUser(toAuthUser(me));
    } finally {
      setLoading(false);
    }
  }

  // Restore session on app start
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const access = await getAccessToken();
        const refresh = await getRefreshToken();

        // No refresh token = no session to restore
        if (!refresh) {
          if (alive) setUser(null);
          return;
        }

        // Don't have access token (old installs / cleared access),
        // try to refresh once to obtain new pair.
        if (!access) {
          try {
            const refreshed = await refreshApi(refresh);

            const accessToken = refreshed?.accessToken;
            const refreshToken = refreshed?.refreshToken;

            if (typeof accessToken !== "string" || accessToken.length === 0) {
              throw new Error("Refresh did not return a valid accessToken.");
            }
            if (typeof refreshToken !== "string" || refreshToken.length === 0) {
              throw new Error("Refresh did not return a valid refreshToken.");
            }

            await saveTokens(accessToken, refreshToken);
          } catch {
            await clearTokens();
            if (alive) setUser(null);
            return;
          }
        }

        // Validate by calling /me.
        // If access is expired, apiFetch will refresh automatically and retry.
        const me = await meApi();
        if (alive) setUser(toAuthUser(me));
      } catch {
        await clearTokens();
        if (alive) setUser(null);
      } finally {
        if (alive) setAuthReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setOnUnauthorized(() => {
      // Hard logout: clear both tokens + user
      (async () => {
        await clearTokens();
        setUser(null);
      })();
    });

    return () => setOnUnauthorized(null);
  }, []);

  async function login(identifier: string, password: string) {
    setLoading(true);
    try {
      const result = await loginApi(identifier, password);

      const accessToken = result?.accessToken;
      const refreshToken = result?.refreshToken;

      if (typeof accessToken !== "string" || accessToken.length === 0) {
        throw new Error("Login response did not include a valid accessToken.");
      }
      if (typeof refreshToken !== "string" || refreshToken.length === 0) {
        throw new Error("Login response did not include a valid refreshToken.");
      }

      await saveTokens(accessToken, refreshToken);
      await refreshMe();
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, email: string, password: string) {
    setLoading(true);
    try {
      const result = await registerApi(username, email, password);

      const accessToken = result?.accessToken;
      const refreshToken = result?.refreshToken;

      if (typeof accessToken !== "string" || accessToken.length === 0) {
        throw new Error("Register response did not include a valid accessToken.");
      }
      if (typeof refreshToken !== "string" || refreshToken.length === 0) {
        throw new Error("Register response did not include a valid refreshToken.");
      }

      await saveTokens(accessToken, refreshToken);
      await refreshMe();
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (loading) return;

    setLoading(true);
    try {
      const refreshToken = await getRefreshToken();

      if (refreshToken) {
        try {
          await logoutApi(refreshToken);
        } catch {
          // ignore
        }
      }

      await clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({ user, loading, authReady, login, register, logout, refreshMe }),
    [user, loading, authReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
