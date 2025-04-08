import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginSupplierApi } from "../../api/supplierApi";
// import "../../styles/SupplierLogin.css"
import { Link } from "react-router-dom";

const SupplierLogin = () => {
  // State to hold form data (phone number and password)
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });

  // Mutation for handling the login API request
  const mutation = useMutation({
    mutationFn: loginSupplierApi,  // calling the loginSupplierApi function
    onSuccess: (response) => {
      // Save the token and role in local storage upon successful login
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", "supplier");
      // Navigate to the orders page for the supplier
      window.location.href = "/ordersBySupplier";
    },
    onError: (error) => {
      // Handle the error if the login fails
      console.error("Login failed:", error);
    }
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData); // Call the login API with the form data
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Supplier Login</h2>
        {/* Display error or success messages based on mutation state */}
        {mutation.isError && <p className="error-text">Error: {mutation.error.message}</p>}
        {mutation.isSuccess && <p className="success-text">Successful login!</p>}
        
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Submit button disabled when loading */}
          <button type="submit" className="login2-button" disabled={mutation.isLoading}>
            Login
          </button>

          {/* Link to the Supplier Registration page */}
          <Link className="to-register" to="/SupplierRegister">Not registered yet? Register here</Link>
        </form>
      </div>
    </div>
  );
};

export default SupplierLogin;
