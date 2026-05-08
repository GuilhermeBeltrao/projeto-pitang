import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { login as loginService } from "../services/auth";
import type { User, UserRole } from "../types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
};

const STORAGE_TOKEN = "auth_token";
const STORAGE_USER = "auth_user";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_USER);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const result = await loginService(email, senha);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem(STORAGE_TOKEN, result.token);
      localStorage.setItem(STORAGE_USER, JSON.stringify(result.user));
    } catch (error) {
      toast.error("Nao foi possivel autenticar");
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) {
      return false;
    }
    return roles.includes(user.perfil);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, hasRole }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
