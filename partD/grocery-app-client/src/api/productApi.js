import axios from "axios";

// API endpoint for managing products
const API_URL = "http://localhost:3001/products";

/**
 * Get products of the supplier.
 * 
 * @param {string} token - The authentication token.
 * @returns {Object[]} The list of products.
 * @throws {Error} If the request fails.
 */
export const getProductsApi = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/getProducts`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error loading products");
    }
};

/**
 * Add a new product.
 * 
 * @param {Object} productData - The product data to be added.
 * @returns {Object} The response data.
 * @throws {Error} If the request fails.
 */
export const addProductApi = async (productData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_URL}/addProduct`, productData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error adding the product");
    }
};
