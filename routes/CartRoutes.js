
import express from "express";
import { clearCart } from "../controllers/cartController.js"; 
const router = express.Router();
import {
  createOrUpdateCart,
  getCartByUser,
  deleteCartItem,
  updateCartItemQuantity, //  New controller for quantity update
} from "../controllers/cartController.js";

console.log(" Cart routes loaded");

// Routes
router.post("/", createOrUpdateCart);               // Add to cart
router.get("/:userId", getCartByUser);              // Get cart
router.delete("/:userId/item", deleteCartItem);     // Remove item
router.patch("/:userId/item", updateCartItemQuantity); //  Update quantity
router.delete("/:userId", clearCart); //  Clear entire cart

export default router;
