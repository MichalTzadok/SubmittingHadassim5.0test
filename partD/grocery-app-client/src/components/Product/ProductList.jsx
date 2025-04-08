import { useState, useEffect } from "react";
import { createOrderApi } from "../../api/orderApi";
import { getSuppliersApi } from "../../api/supplierApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import "../../styles/ProductList.css"; 
import { useNavigate } from "react-router-dom";

const ProductList = () => {
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [products, setProducts] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token"); 
    // Redirect to the login page if there is no token
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate("/OwnerLogin");
        }
    }, [token, navigate]);

    const { data: suppliers, error, isLoading } = useQuery({
        queryKey: ['suppliers'],
        refetchOnWindowFocus: true,
        refetchInterval: 60000, 
        queryFn: () => {
            const response = getSuppliersApi(token);
            return response;
        },
    });

    // Load products for the selected supplier
    const handleSupplierChange = (e) => {
        const supplierId = e.target.value;
        setSelectedSupplier(supplierId);
    
        const selectedSupplierObj = suppliers.find(s => s._id === supplierId);
    
        if (selectedSupplierObj && selectedSupplierObj.products.length > 0) {
            setProducts(selectedSupplierObj.products);
            setMessage("");
        } else {
            setProducts([]);
            setMessage("No products found for this supplier.");
        }
    
        setOrderItems([]); 
    };

    // Add product to the order
    const handleAddProduct = (product) => {
        setOrderItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.productId === product._id);

            if (existingItem) {
                // If the product already exists in the order, increase the quantity
                return prevItems.map((item) =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // If the product is new, add it to the order with quantity 1
                return [...prevItems, { productId: product._id, productName: product.name, quantity: 1 }];
            }
        });
    };

    // Update product quantity in the order
    const handleQuantityChange = (index, value) => {
        const updatedItems = [...orderItems];
        updatedItems[index].quantity = value;
        setOrderItems(updatedItems);
    };

    const mutation = useMutation({
        mutationFn: createOrderApi,
        onError: (error) => {
            setMessage("Error: " + error);
        }
    });

    const handleSubmit = async (e) => {
        setMessage(""); // Clear previous messages
        e.preventDefault();
        if (!selectedSupplier || orderItems.length === 0) {
            setMessage("Please select a supplier and add products to the order.");
            return;
        }

        const selectedSupplierObj = suppliers.find(s => s._id === selectedSupplier);
        const supplierName = selectedSupplierObj ? selectedSupplierObj.companyName : "";
        let hasError = false; // Check if there is an error with the quantity

        // Check if the quantity is less than the minimum required
        orderItems.map(item => {
            const product = products.find(p => p._id === item.productId);
            if (product) {
                if (item.quantity < product.minQuantity) {
                    setMessage("The minimum order for " + product.name + " is " + product.minQuantity);
                    hasError = true;
                    return; 
                }
            }
        });
    
        // If there is an error, do not submit the order
        if (hasError) {
            return;
        }
        const orderData = { supplierId: selectedSupplier, supplierName: supplierName, items: orderItems };

        try {
            await mutation.mutateAsync({ orderData, token }); // Submit the order
        } catch (error) {
            setMessage("Error: " + error);
        }
    };

    if (isLoading) return <p>Loading suppliers...</p>;
    if (error) return <p>Error loading suppliers: {error.message}</p>;

    return (
        <div className="order-container">
            <h2 className="order-title">Add Order</h2>
            {mutation.isSuccess && <p className="success">Order added successfully!</p>}
            {message && <p className="status-message">{message}</p>}
            <form className="order-form" onSubmit={handleSubmit}>
                <label style={{textAlign:"left"}} className="order-label">Select Supplier</label>
                <select
                    className="order-select"
                    value={selectedSupplier}
                    onChange={handleSupplierChange}
                    required
                >
                    <option value="">Select Supplier</option>
                    {suppliers?.map(supplier => (
                        <option key={supplier._id} value={supplier._id}>
                            {supplier.companyName}
                        </option>
                    ))}
                </select>

                <h3 className="products-title">Available Products</h3>
                <div className="available-products">
                    {products.map(product => (
                        <div key={product._id} className="product-item">
                            <span className="product-name">{product.name} - ₪{product.price}</span>
                            <button
                                type="button"
                                className="btn-add"
                                onClick={() => handleAddProduct(product)}
                            >
                                ➕ Add
                            </button>
                        </div>
                    ))}
                </div>

                <h3 className="order-details-title">Order Details</h3>
                <div className="order-items">
                    {orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                            <span className="order-product-name">
                                {products.find(p => p._id === item.productId)?.name}
                            </span>
                            <input
                                type="number"
                                min="1"
                                className="order-quantity"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn-primary">Submit Order</button>
            </form>
        </div>
    );
};

export default ProductList;
