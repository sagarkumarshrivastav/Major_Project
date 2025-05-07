import React from "react";
import Profile from "./Profile";

const Header = () => {
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-lg font-bold">Lost & Found</h1>
      <Profile />
    </header>
  );
};

export default Header;