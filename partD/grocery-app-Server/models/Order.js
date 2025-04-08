import { Schema, model } from "mongoose";

/**
 * Order schema representing a purchase order from a supplier.
 */
const orderSchema = new Schema({
  /**
   * The ID of the supplier associated with this order.
   */
  supplierId: {
    type: Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },

  /**
   * The name of the supplier (redundant for history even if supplier is deleted).
   */
  supplierName: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Array of items included in the order.
   */
  items: [{
    /**
     * The ID of the product being ordered.
     */
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    /**
     * Name of the product (stored for historical tracking).
     */
    productName: {
      type: String,
      required: true,
      trim: true
    },

    /**
     * Quantity of the product being ordered.
     */
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],

  /**
   * The current status of the order.
   * Can be: pending → in process → completed
   */
  status: {
    type: String,
    enum: ["pending", "in process", "completed"],
    default: "pending"
  },

  /**
   * Timestamp of order creation.
   */
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

export const Order = model("Order", orderSchema);
