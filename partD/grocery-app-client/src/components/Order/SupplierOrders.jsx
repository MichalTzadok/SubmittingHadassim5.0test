import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrdersBySupplierApi, updateOrderStatusApi } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SupplierOrders = () => {
    const [message, setMessage] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Redirect to login if the token doesn't exist
    useEffect(() => {
        if (!token) {
            navigate("/SupplierLogin");
        }
    }, [token, navigate]);

    const decodedToken = jwtDecode(token);
    const supplierId = decodedToken._id;

    const { data: orders, error, isLoading, refetch } = useQuery({
        queryKey: ['orders', supplierId],  // Get orders by supplier id
        queryFn: () => getOrdersBySupplierApi(token),
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        enabled: !!token,
    });

    useEffect(() => {
        refetch();
    }, [filter]);

    const mutation = useMutation({
        mutationFn: updateOrderStatusApi,
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            setMessage("Error updating the status: " + error.message);
        }
    });

    const handleStartProcessingOrder = async (orderId, status) => {
        setMessage("");
        try {
            await mutation.mutateAsync({ orderId, status, token });  // Call the API to update the order status
        } catch (error) {
            setMessage("Error starting order processing: " + error.message);
        }
    };

    // Filter orders based on the selected filter
    const filteredOrders = orders?.filter((order) => {
        if (filter === "all") {
            return true;  // All orders
        }
        if (filter === "completed") {
            return order.status !== "completed";  // Orders that are not completed
        }
        return true;
    });

    if (isLoading) return <p>Loading orders...</p>;
    if (error) return <p>Error fetching orders: {error.message}</p>;

    return (
        <div className="orders-container">
            <h2 className="orders-title">Supplier Orders</h2>

            <div className="filter-buttons">
                <button
                    className={filter === "all" ? "active" : ""}
                    onClick={() => { setFilter("all"); setSelectedOrder(null); }}
                >
                    All Orders
                </button>
                <button
                    className={filter === "completed" ? "active" : ""}
                    onClick={() => { setFilter("completed"); setSelectedOrder(null); }}
                >
                    Orders in Process
                </button>
            </div>

            {mutation.isSuccess && <p className="success">The status has been updated successfully!</p>}
            {message && <p className="status-message">{message}</p>}

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Products</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders?.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                There are no orders to display
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].slice(0, 5)}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button
                                        className="view-products-btn"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        View Products
                                    </button>
                                </td>
                                <td>
                                    {order.status === "pending" && (
                                        <button
                                            className="complete-btn"
                                            onClick={() => handleStartProcessingOrder(order._id, "in process")}
                                        >
                                            Start Process
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="order-products-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Products in Order</h3>
                        <ul>
                            {selectedOrder.items.map((item, index) => (
                                <li key={index}>
                                    {item.productName} - {item.quantity} quantities
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setSelectedOrder(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierOrders;
