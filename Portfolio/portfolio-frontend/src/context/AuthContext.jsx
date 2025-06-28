import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Check if token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser(decodedUser);
        } else {
          localStorage.removeItem("token"); // Token expired
        }
      } catch (error) {
        console.error("Failed to decode token or token is invalid:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedUser = jwtDecode(token);
    setIsAuthenticated(true);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};