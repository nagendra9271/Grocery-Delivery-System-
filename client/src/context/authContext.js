import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

// Create Authentication Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // ✅ Store user data
  const [loading, setLoading] = useState(true); // ✅ Track loading state
  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const userData = localStorage.getItem("user");

      if (token && role) {
        setIsLoggedIn(true);
        setToken(token);
        setUserRole(role);
        setUser(userData ? JSON.parse(userData) : null); // ✅ Parse user data
      }
      setLoading(false); // ✅ Auth check complete
    }
  }, []);

  // ✅ Login Function
  const login = (token, role, userData) => {
    console.log(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      } // ✅ Store user data as JSON
    }
    setIsLoggedIn(true);
    setUserRole(role);
    setToken(token);
    setUser(userData);
    router.push(role === "seller" ? "/seller/dashboard" : "/student/dashboard");
  };

  // ✅ Logout Function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
    }
    setIsLoggedIn(false);
    setUserRole(null);
    setToken(null);
    setUser(null);
    router.replace("/"); // Prevents going back to protected pages
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, user, token, login, logout, loading }} // ✅ Include loading state
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to Use Auth
export function useAuth() {
  return useContext(AuthContext);
}
