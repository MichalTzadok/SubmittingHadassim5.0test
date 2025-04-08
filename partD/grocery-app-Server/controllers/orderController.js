import { Order } from "../models/Order.js";
import { Stock } from "../models/Stock.js";

// view orders by supplier
export const getOrdersBySupplier = async (req, res) => {
    try {
        const orders = await Order.find({ supplierId: req.user.id });
        res.status(200).json(orders); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error while retrieving orders for supplier" });
    }
};

// view all orders by store owner
export const getOrdersByStoreOwner = async (req, res) => {
    try {
        console.log("Fetching all orders for store owner...");
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error while retrieving orders for store owner" });
    }
};

// add new order
export const createOrder = async (req, res) => {
    const { supplierId, supplierName, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "The order must include products" });
    }

    try {
        // create new order
        const newOrder = new Order({
            supplierId,
            supplierName,
            items,
            status: "pending",  // default status
        });

        // save order to DB
        await newOrder.save();

        // update stock quantities for each item
        const productNames = newOrder.items.map(item => item.productName);
        const stockItems = await Stock.find({ name: { $in: productNames } });

        newOrder.items.forEach(item => {
            const stockItem = stockItems.find(stock => stock.name === item.productName);
            if (stockItem) {
                stockItem.quantity += item.quantity;
                stockItem.save();
            }
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error while creating the order" });
    }
};

// update order status to "completed"
export const completeOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = "completed"; 
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error while updating order status to completed" });
    }
}

// update order status to "in process"
export const confirmOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        console.log("Order found:", order); 
        order.status = "in process"; 
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error while updating order status to in process" });
    }
};
