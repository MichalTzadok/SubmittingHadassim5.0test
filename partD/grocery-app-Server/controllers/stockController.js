import { Stock } from "../models/Stock.js";
import { Supplier } from "../models/Supplier.js";
import { Order } from "../models/Order.js";

/**
 * Processes stock data received from a cash register system.
 *
 * For each sold product:
 *  - Updates the quantity in stock.
 *  - If quantity falls below minimum threshold:
 *      - Finds the cheapest supplier that sells the product.
 *      - Creates an automatic order for the supplier.
 *      - Updates stock quantity to reflect the ordered amount.
 *
 * @param {Object} req - The request object containing sold product quantities.
 * @param {Object} res - The response object used to return results or errors.
 * @returns {void}
 */
export const handleStockData = async (req, res) => {
    const purchase = req.body;
    const autoOrderedProductNames = [];

    try {
        for (const [productName, quantitySold] of Object.entries(purchase)) {
            // Find the stock item by name
            const stockItem = await Stock.findOne({ name: productName });

            if (!stockItem) {
                console.warn(`Product not found in stock: ${productName}`);
                continue;
            }

            // Update stock quantity
            stockItem.quantity -= quantitySold;
            await stockItem.save();

            // Check if quantity fell below minimum
            if (stockItem.quantity < stockItem.minQuantity) {
                // Find suppliers offering this product
                const suppliers = await Supplier.find({
                    "products.name": productName
                });

                if (suppliers.length === 0) {
                    console.warn(`No suppliers found for product: ${productName}`);
                    continue;
                }

                // Find the cheapest supplier
                const bestOption = suppliers
                    .map(supplier => {
                        const product = supplier.products.find(p => p.name === productName);
                        if (!product) return null;
                        return {
                            supplierId: supplier._id,
                            supplierName: supplier.companyName,
                            productId: product._id,
                            productName: product.name,
                            minQuantity: product.minQuantity,
                            price: product.price
                        };
                    })
                    .filter(Boolean)
                    .sort((a, b) => a.price - b.price)[0];

                if (!bestOption) continue;

                // Calculate order quantity: enough to meet minimum threshold
                const neededQuantity = stockItem.minQuantity - stockItem.quantity;
                const orderQuantity = Math.max(neededQuantity, bestOption.minQuantity);

                // Create a new order
                const newOrder = new Order({
                    supplierId: bestOption.supplierId,
                    supplierName: bestOption.supplierName,
                    items: [{
                        productId: bestOption.productId,
                        productName: bestOption.productName,
                        quantity: orderQuantity
                    }],
                    status: "pending"
                });

                await newOrder.save();
                autoOrderedProductNames.push(bestOption.productName);

                // Reflect ordered quantity in stock
                stockItem.quantity += orderQuantity;
                await stockItem.save();
            }
        }

        // Respond with success and the list of auto-ordered product names
        res.status(200).json({
            message: "Cash register data processed successfully",
            autoOrderedProductNames
        });

    } catch (error) {
        console.error("Error processing stock data:", error);
        res.status(500).json({ message: "Error processing stock data" });
    }
};
