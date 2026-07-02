import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AuthUser = {
  id: number;
  email: string;
  role: "player" | "agent" | "club";
  playerId?: number | null;
  agentId?: number | null;
  clubId?: number | null;
  emailVerified?: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  profile: any | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser, profile: any) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    
    setToken(storedToken);
    
    // Using manual fetch to avoid React Query ordering issues on initial load
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
          throw new Error("Invalid response format");
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        localStorage.removeItem("user_token");
        setToken(null);
        setUser(null);
        setProfile(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = (newToken: string, newUser: AuthUser, newProfile: any) => {
    localStorage.setItem("user_token", newToken);
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to refresh");
      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
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
