import { Schema, model } from "mongoose";

/**
 * Supplier schema representing a supplier entity and its products.
 */
const supplierSchema = new Schema({
  /**
   * Name of the supplier's company.
   */
  companyName: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Phone number of the supplier. Used as a unique identifier for login.
   */
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  /**
   * Full name of the supplier's representative.
   */
  representativeName: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Password for authentication (should be hashed before saving).
   */
  password: {
    type: String,
    required: true
  },

  /**
   * List of products supplied by this supplier.
   */
  products: [
    {
      /**
       * Name of the product.
       */
      name: {
        type: String,
        required: true,
        trim: true
      },

      /**
       * Price of the product.
       */
      price: {
        type: Number,
        required: true,
        min: 0
      },

      /**
       * Minimum quantity the supplier can provide per order.
       */
      minQuantity: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

export const Supplier = model("Supplier", supplierSchema);
