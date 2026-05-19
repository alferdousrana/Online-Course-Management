import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when component mounts
  useEffect(() => {
    const tokenExists = !!localStorage.getItem("token");
    setIsLoggedIn(tokenExists);

    // If already logged out, redirect to login
    if (!tokenExists) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4 text-center">
        <h4 className="mb-3 text-danger">
          <i className="fas fa-sign-out-alt me-2"></i>Confirm Logout
        </h4>
        <p className="mb-4">
          Are you sure you want to log out of your account?
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-danger px-4" onClick={handleLogout}>
            <i className="fas fa-power-off me-1"></i> Logout
          </button>
          <button className="btn btn-secondary px-4" onClick={handleCancel}>
            <i className="fas fa-times me-1"></i> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
