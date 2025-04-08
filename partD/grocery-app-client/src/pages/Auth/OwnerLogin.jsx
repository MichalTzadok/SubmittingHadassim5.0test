import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
// import "../../styles/SupplierLogin.css"
import { loginOwnerApi } from "../../api/ownerApi";
import { useNavigate } from "react-router-dom";

const OwnerLogin = () => {
  // State to hold form data (name and password)
  const [formData, setFormData] = useState({
    name: "",
    password: ""
  });
  const navigate = useNavigate();

  // Mutation for handling the login API request
  const mutation = useMutation({
    mutationFn: loginOwnerApi,  // calling the loginOwnerApi function
    onSuccess: (response) => {
      // Save the token and role in local storage upon successful login
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", "owner");
      // Navigate to the products page
      window.location.href = "/products";
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
        <h2 className="login-title">Store Owner Login</h2>
        {/* Display error or success messages based on mutation state */}
        {mutation.isError && <p className="error-text">Error: {mutation.error.message}</p>}
        {mutation.isSuccess && <p className="success-text">Successful login!!</p>}
        
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
