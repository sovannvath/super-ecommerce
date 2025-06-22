import React, { createContext, useContext, useEffect, useState } from "react";
import { api, type User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  getUserRole: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const checkAuth = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        api.setToken(token);
        const userData = await api.getUser();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      // Check if it's a network error (Failed to fetch)
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("Failed to fetch") ||
          error.message.includes("Network error") ||
          error.message.includes("fetch"));

      if (isNetworkError && retryCount < 2) {
        // Retry up to 2 times for network errors with exponential backoff
        console.log(`Retrying auth check (attempt ${retryCount + 1}/2)...`);
        setTimeout(
          () => {
            checkAuth(retryCount + 1);
          },
          Math.pow(2, retryCount) * 1000,
        ); // 1s, 2s delays
        return;
      }

      // If it's not a network error or we've exhausted retries, clear auth
      if (!isNetworkError || retryCount >= 2) {
        console.log("Clearing authentication due to persistent error");
        localStorage.removeItem("auth_token");
        api.clearToken();
        setUser(null);
      }
    } finally {
      // Only set loading to false on final attempt or success
      if (retryCount === 0) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login({ email, password });
      api.setToken(response.token);
      setUser(response.user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${response.user.name}`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role?: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await api.register({
        name,
        email,
        password,
        password_confirmation: password,
        role,
      });
      api.setToken(response.token);
      setUser(response.user);
      toast({
        title: "Account created!",
        description: `Welcome ${response.user.name}`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignore logout errors, just clear local state
    } finally {
      api.clearToken();
      setUser(null);
      toast({
        title: "Logged out",
        description: "See you next time!",
      });
    }
  };

  const getUserRole = (): string => {
    if (!user) return "guest";
    if (user.role) return user.role;

    // Map Laravel role_id to role names
    const roleMap: { [key: number]: string } = {
      1: "admin",
      2: "staff",
      3: "customer",
      4: "warehouse",
    };

    return roleMap[user.role_id || 3] || "customer";
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    getUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
