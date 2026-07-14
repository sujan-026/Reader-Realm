import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
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
  likedBooks: string[];
  toggleLikeBook: (bookId: string) => void;
  isBookLiked: (bookId: string) => boolean;
}

const UserContext = createContext<AuthContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedBooks, setLikedBooks] = useState<string[]>([]);

  // ✅ Ensure user is loaded from localStorage before setting isLoading to false
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const savedUser = localStorage.getItem("user");
      const savedLikedBooks = localStorage.getItem("likedBooks");

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // console.log("Loaded user from localStorage:", parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          localStorage.removeItem("user");
        }
      }

      if (savedLikedBooks) {
        try {
          setLikedBooks(JSON.parse(savedLikedBooks));
        } catch (error) {
          console.error("Error parsing likedBooks:", error);
          localStorage.removeItem("likedBooks");
        }
      }

      setIsLoading(false); // Set loading to false **after** user is loaded
    };

    loadUserFromStorage();
  }, []);

  // ✅ Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // console.log("Saving user to localStorage:", user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // console.log("Removing user from localStorage");
      localStorage.removeItem("user");
    }
  }, [user]);

  // ✅ Save liked books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("likedBooks", JSON.stringify(likedBooks));
  }, [likedBooks]);

  // ✅ LOGIN FUNCTION
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        setUser(data.data); // Fix: Correctly set user from API response
        toast.success("Successfully logged in!");
        return true;
      } else {
        toast.error(data.message || "Invalid email or password");
        return false;
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGOUT FUNCTION
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Successfully logged out");
  };

  // ✅ SIGNUP FUNCTION
  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role: "user" }),
        }
      );

      const data = await response.json();
      console.log("Signup response data:", data);

      if (response.ok) {
        setUser(data.data);
        toast.success("Account created successfully!");
        return true;
      } else {
        toast.error(data.message || "Sign-up failed");
        return false;
      }
    } catch (error) {
      toast.error("Sign-up failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  

  // ✅ RESET PASSWORD FUNCTION
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_URL}/api/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset link sent to your email");
        return true;
      } else {
        toast.error(data.message || "No account found with this email");
        return false;
      }
    } catch (error) {
      toast.error("Password reset failed. Please try again.");
      return false;
    }
  };

  // ✅ BOOK LIKING FUNCTIONALITY
  const toggleLikeBook = (bookId: string) => {
    if (!user) {
      toast.error("Please log in to like books");
      return;
    }

    setLikedBooks((prev) => {
      if (prev.includes(bookId)) {
        toast.success("Book removed from favorites");
        return prev.filter((id) => id !== bookId);
      } else {
        toast.success("Book added to favorites");
        return [...prev, bookId];
      }
    });
  };

  const isBookLiked = (bookId: string): boolean => {
    return likedBooks.includes(bookId);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signUp,
        resetPassword,
        likedBooks,
        toggleLikeBook,
        isBookLiked,
      }}
    >
      {!isLoading && children} {/* Only render children after loading user */}
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
