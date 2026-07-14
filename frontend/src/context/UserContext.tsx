import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { API_URL, authHeaders, clearToken, setToken } from "@/lib/api";
import { Loader2 } from "lucide-react";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  likedBooks: string[];
  toggleLikeBook: (bookId: string) => void;
  isBookLiked: (bookId: string) => boolean;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (raw: Record<string, unknown>): User => ({
  id: String(raw.id || raw._id || ""),
  _id: raw._id ? String(raw._id) : undefined,
  name: String(raw.name || ""),
  email: String(raw.email || ""),
  avatar: raw.avatar ? String(raw.avatar) : undefined,
  role: (raw.role as UserRole) || "user",
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [likedBooks, setLikedBooks] = useState<string[]>([]);

  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem("user");
      const savedLikedBooks = localStorage.getItem("likedBooks");

      if (savedUser) {
        try {
          setUser(normalizeUser(JSON.parse(savedUser)));
        } catch {
          localStorage.removeItem("user");
          clearToken();
        }
      }

      if (savedLikedBooks) {
        try {
          setLikedBooks(JSON.parse(savedLikedBooks));
        } catch {
          localStorage.removeItem("likedBooks");
        }
      }

      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("likedBooks", JSON.stringify(likedBooks));
  }, [likedBooks]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthBusy(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) setToken(data.token);
        setUser(normalizeUser(data.data));
        toast.success("Successfully logged in!");
        return true;
      }

      toast.error(data.message || "Invalid email or password");
      return false;
    } catch {
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearToken();
    localStorage.removeItem("user");
    toast.success("Successfully logged out");
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setAuthBusy(true);

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) setToken(data.token);
        setUser(normalizeUser(data.data));
        toast.success("Account created successfully!");
        return true;
      }

      toast.error(data.message || "Sign-up failed");
      return false;
    } catch {
      toast.error("Sign-up failed. Please try again.");
      return false;
    } finally {
      setAuthBusy(false);
    }
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    toast.error("Password reset is not available yet. Contact an admin.");
    return false;
  };

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : prev));
  };

  const toggleLikeBook = (bookId: string) => {
    if (!user) {
      toast.error("Please log in to like books");
      return;
    }

    setLikedBooks((prev) => {
      if (prev.includes(bookId)) {
        toast.success("Book removed from favorites");
        return prev.filter((id) => id !== bookId);
      }
      toast.success("Book added to favorites");
      return [...prev, bookId];
    });
  };

  const isBookLiked = (bookId: string): boolean => {
    return likedBooks.includes(bookId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: authBusy,
        login,
        logout,
        signUp,
        resetPassword,
        updateUser,
        likedBooks,
        toggleLikeBook,
        isBookLiked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): AuthContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Re-export for callers that need auth headers alongside user context
export { authHeaders };
