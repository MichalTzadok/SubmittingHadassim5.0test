import { Router } from "express";
import { handleStockData } from "../controllers/stockController.js";

const stockRoute = Router();

stockRoute.post("/manageStock", handleStockData);

export default stockRoute;
