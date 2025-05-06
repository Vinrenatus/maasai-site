import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "../lib/jwtDecodeWrapper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwt_decode(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          console.warn("Token expired, logging out...");
          logout();
        } else {
          setUser(decodedUser);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem("token", token);
      const decodedUser = jwt_decode(token);
      if (decodedUser.exp * 1000 < Date.now()) {
        console.warn("Received expired token, logging out...");
        logout();
      } else {
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);