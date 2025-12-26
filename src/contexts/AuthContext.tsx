import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type UserRole = "owner" | "kasir" | "dapur";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for authentication
const DUMMY_USERS: { username: string; password: string; user: User }[] = [
  {
    username: "owner",
    password: "123456",
    user: {
      id: "1",
      username: "owner",
      name: "Owner",
      role: "owner",
    },
  },
  {
    username: "kasir",
    password: "123456",
    user: {
      id: "2",
      username: "kasir",
      name: "Kasir",
      role: "kasir",
    },
  },
  {
    username: "dapur",
    password: "123456",
    user: {
      id: "3",
      username: "dapur",
      name: "Dapur",
      role: "dapur",
    },
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("pos_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("pos_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.user);
      localStorage.setItem("pos_user", JSON.stringify(foundUser.user));
      return { success: true };
    }

    return { success: false, error: "Username atau password salah" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pos_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
