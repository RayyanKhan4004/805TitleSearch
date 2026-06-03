"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch } from "@/app/store/lib";
import { login as reduxLogin, logout as reduxLogout } from "@/app/store/slices/authSlice";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { id: number; email: string; firstName: string; lastName: string } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("auth_user") : null;
    if (stored && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(reduxLogin({ token: stored, user: parsedUser }));
      setIsAuthenticated(true);
      setUser(parsedUser);
    }
    setIsChecking(false);
  }, [dispatch]);

  useEffect(() => {
    if (!isChecking) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      }
      if (isAuthenticated && pathname === "/login") {
        router.push("/table");
      }
    }
  }, [isAuthenticated, isChecking, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const token = data.access_token;
      const userData = data.user;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      dispatch(reduxLogin({ token, user: userData }));
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    dispatch(reduxLogout());
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  if (isChecking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "var(--bg-page)" }}>
        <div className="text-text-muted text-[12px]">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
