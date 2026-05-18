"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (stored) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

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

  const login = async (username: string, password: string): Promise<boolean> => {
    const validUsername = process.env.NEXT_PUBLIC_AUTH_USERNAME || "admin";
    const validPassword = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "Admin@123";

    if (username === validUsername && password === validPassword) {
      localStorage.setItem("auth_token", "authenticated");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setIsAuthenticated(false);
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
