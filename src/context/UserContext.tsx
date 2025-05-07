import React, { createContext, useState, useEffect } from "react";
import { UserProvider } from "./context/UserContext";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage or API
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (userData) => {
    // Save user data to context
    setUser(userData);

    // Save user data to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogin }}>
      {children}
    </UserContext.Provider>
  );
};

<UserProvider>
  <App />
</UserProvider>;