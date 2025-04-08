import { Router } from "express";
import { loginOwner } from "../controllers/authController.js";


const ownerRoute = Router();

ownerRoute.post("/login", loginOwner);


export default ownerRoute;
