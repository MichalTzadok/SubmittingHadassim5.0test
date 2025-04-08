import { Router } from "express";
import express from "express";
import { registerSupplier, loginSupplier, getSupplier } from "../controllers/authSupplierController.js";
import { authorizeOwner, authenticateToken } from "../middleware/authMiddleware.js";

const supplierRoute = Router();

supplierRoute.post("/register", registerSupplier);

supplierRoute.post("/login", loginSupplier);

supplierRoute.get("/getSupplier",authenticateToken, authorizeOwner, getSupplier);

export default supplierRoute;
