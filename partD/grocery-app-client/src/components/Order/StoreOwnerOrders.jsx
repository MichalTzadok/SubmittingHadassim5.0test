import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getOrdersByStoreOwnerApi, completeOrderApi } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";

const StoreOwnerOrders = () => {
    const [message, setMessage] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Redirect to login page if token is not available
    useEffect(() => {
        if (!token) {
            navigate("/OwnerLogin");
        }
    }, [token, navigate]);

    // Fetch orders for the store owner
    const { data: orders, error, isLoading, refetch } = useQuery({
        queryKey: ['storeOwnerOrders'],
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        queryFn: () => getOrdersByStoreOwnerApi(token),
        enabled: !!token,
    });

    const mutation = useMutation({
        mutationFn: completeOrderApi, // Update the order status
        onSuccess: () => {
            refetch();
        },
        onError: (error) => {
            setMessage("Error updating the status: " + error.message);
        }
    });

    // Handle order completion
    const handleCompleteOrder = async (orderId, status) => {
        setMessage("");
        try {
            await mutation.mutateAsync({ orderId, status, token });
        } catch (error) {
            setMessage("Error completing order: " + error);
        }
    };

    // View the products in the selected order
    const handleViewProducts = (orderId) => {
        const order = orders.find(order => order._id === orderId);
        setSelectedOrder(order);
    };

    if (isLoading) return <p>Loading orders...</p>;
    if (error) return <p>Error fetching orders: {error.message}</p>;

    return (
        <div className="orders-container">
            <h2 className="orders-title">Store owner orders</h2>
            {mutation.isSuccess && <p className="success">The status has been updated successfully!</p>}
            {message && <p className="status-message">{message}</p>}
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID </th>
                        <th>Supplier</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Products</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                            There are no orders to display
                            </td>
                        </tr>
                    ) : (
                        orders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{order.supplierName || ""}</td>
                                <td>{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].slice(0, 5)}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button
                                        className="view-products-btn"
                                        onClick={() => handleViewProducts(order._id)}
                                    >
                                       View products
                                    </button>
                                </td>
                                <td>
                                    {order.status === "in process" && (
                                        <button
                                            className="complete-btn"
                                            onClick={() => handleCompleteOrder(order._id, "completed", order.supplierId)}
                                        >
                                           Complete order
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="order-products-modal">
                    <h3>Products in this order</h3>
                    <ul>
                        {selectedOrder.items.map((item, index) => (
                            <li key={index}>
                                {item.productName} - {item.quantity} quantities
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
            )}

        </div>
    );
};

export default StoreOwnerOrders;
