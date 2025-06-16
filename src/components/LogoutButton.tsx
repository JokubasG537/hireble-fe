import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const LogoutButton: React.FC = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <button
     onClick={handleLogout}
     className="logout-button-danger">
      Logout
    </button>
  );
};

export default LogoutButton;