import React, { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Assuming you're using React Context

const Profile = () => {
  const { user } = useContext(UserContext); // Get the logged-in user's data

  return (
    <div className="flex items-center space-x-2">
      <img
        src="/path-to-profile-icon.png" // Replace with your profile icon path
        alt="Profile Icon"
        className="h-8 w-8 rounded-full"
      />
      <span className="text-sm font-medium text-gray-700">
        {user?.name || "Guest"} {/* Display username or "Guest" if not logged in */}
      </span>
    </div>
  );
};

export default Profile;