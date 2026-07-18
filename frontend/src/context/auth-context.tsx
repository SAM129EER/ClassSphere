import React, { createContext, useContext, useState, useEffect } from "react";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: SignUpPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        return { success: false, error: error.message || "Login failed" };
      }
      setUser(data.user as unknown as User);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "An unexpected error occurred" };
    }
  };

  const register = async (payload: SignUpPayload) => {
    try {
      const { data, error } = await authClient.signUp.email(payload);
      if (error) {
        return { success: false, error: error.message || "Registration failed" };
      }
      setUser(data.user as unknown as User);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "An unexpected error occurred" };
    }
  };

  const logout = async () => {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        return { success: false, error: error.message || "Logout failed" };
      }
      setUser(null);
      localStorage.removeItem("user");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "An unexpected error occurred" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
