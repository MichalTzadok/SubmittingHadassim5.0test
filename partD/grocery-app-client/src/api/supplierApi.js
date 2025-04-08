import axios from "axios";

// API endpoint for managing suppliers
const API_URL = "http://localhost:3001/suppliers";

/**
 * Register a new supplier.
 * 
 * @param {Object} supplierData - The supplier data to register.
 * @returns {Object} The registration response data.
 * @throws {Error} If registration fails.
 */
export const registerSupplierApi = async (supplierData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, supplierData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};

/**
 * Login a supplier.
 * 
 * @param {Object} supplierData - The login data for the supplier.
 * @returns {Object} The login response data.
 * @throws {Error} If login fails.
 */
export const loginSupplierApi = async (supplierData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, supplierData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

/**
 * Get all suppliers.
 * 
 * @param {string} token - The authentication token.
 * @returns {Object[]} The list of suppliers.
 * @throws {Error} If the request fails.
 */
export const getSuppliersApi = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/getSupplier`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; // Returns the list of suppliers
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch suppliers");
    }
};
