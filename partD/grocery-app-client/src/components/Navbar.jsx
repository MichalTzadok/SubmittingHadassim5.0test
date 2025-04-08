import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  // State to store the authentication token and user role
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setRole] = useState(localStorage.getItem("role"));
  
  // Navigate hook for page redirection after logout
  const navigate = useNavigate();

  // Function to handle logout by removing the token and role from localStorage and redirecting to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // Redirects to the login page after logging out
  };

  return (
    <nav className="navbar">
      <ul>
        {/* If there's no token, show the login link */}
        {!token ? (
          <li>
            <Link to="/login">Home Page</Link>
          </li>
        ) : (
          <>
            {/* If user is 'owner', show the 'Add Order' link */}
            {userRole === "owner" && (
              <li>
                <Link to="/products">Add Order</Link>
              </li>
            )}

            {/* If user is 'supplier', show 'Orders' and 'Add Product' links */}
            {userRole === "supplier" && (
              <>
                <li>
                  <Link to="/ordersBySupplier">Orders</Link>
                </li>
                <li>
                  <Link to="/addProduct">Add Product</Link>
                </li>
              </>
            )}

            {/* If user is 'owner', show the 'Orders' link */}
            {userRole === "owner" && (
              <li>
                <Link to="/ordersByOwner">Orders</Link>
              </li>
            )}

            {/* Show logout button */}
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
