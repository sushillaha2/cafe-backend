import express from "express";
const router = express.Router();
import {
  clearCart,
  createOrUpdateCart,
  getCartByUser,
  deleteCartItem,
  updateCartItemQuantity, 
} from "../controllers/CartController.js";

console.log(" Cart routes loaded");

// Routes
router.post("/", createOrUpdateCart);               // Add to cart
router.get("/:userId", getCartByUser);              // Get cart
router.delete("/:userId/item", deleteCartItem);     // Remove item
router.patch("/:userId/item", updateCartItemQuantity); //  Update quantity
router.delete("/:userId", clearCart); //  Clear entire cart

export default router;
