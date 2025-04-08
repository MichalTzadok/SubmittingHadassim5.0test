import { Router } from "express";
import {  addProduct, getProducts } from "../controllers/supplierController.js";
import { authenticateToken, authorizeSupplier } from "../middleware/authMiddleware.js";

const productRoute = Router();

productRoute.get('/getProducts', authenticateToken, authorizeSupplier, getProducts);
productRoute.post('/addProduct', authenticateToken, authorizeSupplier, addProduct);

export default productRoute;
