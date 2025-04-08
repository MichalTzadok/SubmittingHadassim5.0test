import { Supplier } from "../models/Supplier.js";

/**
 * Add a new product to the authenticated supplier.
 * Expects name, price, and minQuantity in the request body.
 */
export const addProduct = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.user.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        const { name, price, minQuantity } = req.body;

        // Validate fields
        if (!name || price == null || minQuantity == null) {
            return res.status(400).json({ message: "All product details must be filled in" });
        }

        const newProduct = { name, price, minQuantity };

        supplier.products.push(newProduct);
        await supplier.save();

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

/**
 * Get all products of the authenticated supplier.
 */
export const getProducts = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.user.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json(supplier.products);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};
