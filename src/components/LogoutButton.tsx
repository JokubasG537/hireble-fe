// src/components/LogoutButton.tsx
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const LogoutButton: React.FC = () => {
  const { dispatch } = useContext(UserContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    // Optionally, redirect or show a message here
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
