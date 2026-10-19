import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authApi } from "@/api/auth.api";
import { refreshAccessToken, setSessionExpiredHandler } from "@/api/axios";
import { tokenManager } from "@/api/tokenManager";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authentication after refreshing the browser.
  useEffect(() => {
    let active = true;

    setSessionExpiredHandler(() => {
      if (active) setUser(null);
    });

    async function restoreSession() {
      try {
        if (!tokenManager.getRefreshToken()) return;

        await refreshAccessToken();

        const currentUser = await authApi.getCurrentUser();

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
      setSessionExpiredHandler(null);
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password);

    setUser(data.user);

    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;

      const permissions = user.permissions || [];

      return permissions.includes("*") || permissions.includes(permission);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasPermission,
    }),
    [user, loading, login, logout, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
