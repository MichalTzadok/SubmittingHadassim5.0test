import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerSupplierApi } from "../../api/supplierApi";
// import "../../styles/SupplierRegister.css"
import { useNavigate } from "react-router-dom";

const SupplierRegister = () => {
  const navigate = useNavigate(); 
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    representativeName: "",
    password: "",
    products: []
  });

  // Handle change in product fields
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  // Add a new product to the form data
  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { name: "", price: "", minQuantity: "" }]
    });
  };

  // Mutation for handling the supplier registration API request
  const mutation = useMutation({
    mutationFn: registerSupplierApi,
    onSuccess: (response) => {
      localStorage.setItem("token", response.token); 
      localStorage.setItem("role", "supplier"); 
      window.location.href = "/ordersBySupplier";  // Redirect to the orders page
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset previous error
    
    const { companyName, phoneNumber, representativeName, password, products } = formData;

    // Check for missing required fields
    if (!companyName || !phoneNumber || !representativeName || !password) {
      setErrorMessage("Please fill in all the registration fields.");
      return;
    }

    // Check if all product fields are filled
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.name || !product.price.toString() || !product.minQuantity.toString()) {
        setErrorMessage(`Please fill in all the product fields in row ${i + 1}.`);
        return;
      }
    }

    // Check for duplicate product names
    const names = products.map(p => p.name);
    const hasDuplicates = names.some((name, index) => names.indexOf(name) !== index);
    
    if (hasDuplicates) {
      setErrorMessage("There are duplicate product names. Please ensure that each product is unique.");
      return;
    }

    // Proceed with the mutation if validation passes
    mutation.mutate(formData);
  };

  return (
    <div className="supplier-container">
      <form className="supplier-form" onSubmit={handleSubmit}>
        <h2 className="supplier-title">Supplier Registration</h2>

        {/* Display error, success, and loading messages */}
        {errorMessage && <p className="status-message error">{errorMessage}</p>}
        {mutation.isLoading && <p className="status-message loading">Loading...</p>}
        {mutation.isError && <p className="status-message error">Error: {mutation.error.message}</p>}
        {mutation.isSuccess && <p className="status-message success">Registration successful!</p>}

        {/* Input fields for company details */}
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone number"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
        <input
          type="text"
          name="representativeName"
          placeholder="Representative name"
          value={formData.representativeName}
          onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="text"
          name="companyName"
          placeholder="Company name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
        />

        {/* Section for adding products */}
        <h3 className="products-title">Products</h3>
        {formData.products.map((product, index) => (
          <div key={index} className="product-group">
            <input
              type="text"
              placeholder="Product name"
              value={product.name}
              onChange={(e) => handleProductChange(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) => handleProductChange(index, "price", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Minimum quantity"
              value={product.minQuantity}
              onChange={(e) => handleProductChange(index, "minQuantity", e.target.value)}
              required
            />
          </div>
        ))}

        {/* Add product button */}
        <button type="button" className="btn-add" onClick={addProduct}>➕ Add Product</button>

        {/* Submit button */}
        <button type="submit" className="btn-primary" disabled={mutation.isLoading}>Register</button>
      </form>
    </div>
  );
};

export default SupplierRegister;
