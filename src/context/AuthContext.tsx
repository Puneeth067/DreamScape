 
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Placeholder for user type
interface User {
  id: string;
  name: string;
  email: string;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthContextProvider component
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Example: Check if a user is logged in on initial load
    const checkUser = async () => {
      try {
        // Simulated API call to check user session
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(storedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulated API call
      const fakeUser = { id: "1", name: "John Doe", email };
      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUser(fakeUser);
      router.push("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
