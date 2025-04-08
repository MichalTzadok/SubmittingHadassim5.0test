import axios from "axios";

// API endpoint for owner login
const API_URL = "http://localhost:3001/owner";

/**
 * Function to login the owner.
 * 
 * This function sends a POST request to the server with the owner's login data.
 * If successful, it returns the data from the server (e.g., authentication token).
 * If an error occurs, it throws an error with the server's message or a default message.
 * 
 * @param {Object} OwnerData - The login data for the owner (usually username and password).
 * @returns {Object} The response data from the API, typically an authentication token.
 * @throws {string} An error message if the login fails (either from the server or a default message).
 */
export const loginOwnerApi = async (OwnerData) => {
    try {
        // Sending POST request to login endpoint with the owner's login data
        const response = await axios.post(`${API_URL}/login`, OwnerData);
        
        // Logging the API response for debugging purposes
        console.log("Login owner:", response.data);
        
        // Returning the data received from the API
        return response.data;
    } catch (error) {
        // Handling errors if the API call fails
        // If the server sends a specific error message, return it; otherwise, return a default message
        throw error.response?.data?.message || "Login failed";
    }
};
