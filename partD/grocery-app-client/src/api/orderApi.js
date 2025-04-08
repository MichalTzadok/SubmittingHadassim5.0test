import axios from "axios";

const API_URL = "http://localhost:3001/orders"; 

// Function to get all orders for a supplier by their ID
export const getOrdersBySupplierApi = async (token) => {
    console.log(token); 
    try {
        const response = await axios.get(`${API_URL}/getOrdersSupplier`, {
            headers: { Authorization: `Bearer ${token}` } 
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders for supplier:", error); 
        throw error; 
    }
};

// Function to get all orders for a store owner by their ID
export const getOrdersByStoreOwnerApi = async (token) => {
    console.log("getOrdersByStoreOwnerApi:", token); 
    try {
        const response = await axios.get(`${API_URL}/getOrdersOwner`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching orders for store owner:", error); 
        throw error;
    }
};

// Function to create a new order with provided order data and authorization token
export const createOrderApi = async ({ orderData, token }) => {
    console.log("token", token); 
    try {
        const response = await axios.post(`${API_URL}/newOrder`,
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating new order:", error);
        throw error; 
    }
};

// Function to update the status of an order by the supplier
export const updateOrderStatusApi = async ({ orderId, status, token }) => {
    console.log("orderId:", orderId, "status:", status, "token:", token); 
    try {
        const response = await axios.put(
            `${API_URL}/confirm/${orderId}`,
            { status }, 
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            }
        );
        return response.data; 
    } catch (error) {
        console.error("Error updating order status:", error); 
        throw error; 
    }
};

// Function to update the status of an order by the store owner
export const completeOrderApi = async ({ orderId, status, token }) => {
    console.log("Completing order:", orderId, "token:", token);
    try {
        const response = await axios.put(
            `${API_URL}/complete/${orderId}`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error completing order:", error);
        throw error;
    }
};
