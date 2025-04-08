import { Schema, model } from "mongoose";

/**
 * Stock schema representing a product's inventory record.
 */
const stockSchema = new Schema({
  /**
   * Unique name of the product.
   */
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  /**
   * Current quantity of the product in stock.
   */
  quantity: {
    type: Number,
    required: true,
    min: 0
  },

  /**
   * Minimum required quantity before triggering a restock.
   */
  minQuantity: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export const Stock = model("Stock", stockSchema);
