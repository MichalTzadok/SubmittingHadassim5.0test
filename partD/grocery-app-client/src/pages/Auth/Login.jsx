import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../../styles/Login.css"; 

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2 className="login-title" style={{ fontSize: "35px" }}>
        Welcome to Grocery Management
      </h2>
      <div className="login-buttons">
        {/* Button for Grocery Owner login */}
        <button
          className="login-button storeOwner"
          onClick={() => navigate("/OwnerLogin")} // Navigate to the Owner Login page
        >
          Grocery Owner Login
        </button>
        {/* Button for Supplier login */}
        <button
          className="login-button supplier"
          onClick={() => navigate("/SupplierLogin")} // Navigate to the Supplier Login page
        >
          Supplier Login
        </button>
      </div>
    </div>
  );
};

export default Login;
