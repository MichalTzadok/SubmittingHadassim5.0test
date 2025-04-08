import { Supplier } from "../models/Supplier.js";
import jwt from "jsonwebtoken";

/**
 * Registers a new supplier.
 *
 * Validates that the phone number is not already used.
 * Creates a new supplier record and returns a JWT token.
 *
 * @param {Object} req - The HTTP request containing supplier details in the body.
 * @param {Object} res - The HTTP response object used to return a result or error.
 * @returns {void}
 */
export const registerSupplier = async (req, res) => {
    console.log("Registering supplier...");
    console.log(req.body);

    const { companyName, phoneNumber, representativeName, password, products } = req.body;

    // Check if supplier already exists by phone number
    const existingSupplier = await Supplier.findOne({ phoneNumber });
    if (existingSupplier) {
        return res.status(400).json({ message: "The phone number is already registered in the system" });
    }

    try {
        // Create new supplier
        const newSupplier = new Supplier({
            companyName,
            phoneNumber,
            representativeName,
            password,
            products
        });

        await newSupplier.save();

        // Create JWT token
        const token = jwt.sign({ id: newSupplier._id, role: "supplier" }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(201).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Logs in an existing supplier by verifying phone number and password.
 *
 * Returns a JWT token if login is successful.
 *
 * @param {Object} req - The HTTP request containing phone number and password.
 * @param {Object} res - The HTTP response object used to return a result or error.
 * @returns {void}
 */
export const loginSupplier = async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
        const supplier = await Supplier.findOne({ phoneNumber });

        if (!supplier || supplier.password !== password) {
            return res.status(400).json({ message: "One of the details is incorrect, please try again" });
        }

        // Create JWT token
        const token = jwt.sign({ id: supplier._id, role: "supplier" }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Retrieves all suppliers from the database.
 *
 * Used by the owner or admin to view the list of registered suppliers.
 *
 * @param {Object} req - The HTTP request (no parameters required).
 * @param {Object} res - The HTTP response object used to return supplier data or an error.
 * @returns {void}
 */
export const getSupplier = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
