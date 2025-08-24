import express from "express";
const placeOrderRoutes  = express.Router();
import { placeOrder } from "../controllers/placeOrderController.js";

placeOrderRoutes.post("/", placeOrder);

export default placeOrderRoutes;
