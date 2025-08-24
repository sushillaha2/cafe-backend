

import Cart from "../models/Cart.js";

// Create or update cart
export const createOrUpdateCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      items.forEach((item) => {
        const existingItem = cart.items.find(i =>
          i.title.trim().toLowerCase() === item.title.trim().toLowerCase() &&
          Number(i.price) === Number(item.price)
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          cart.items.push(item);
        }
      });

      await cart.save();
      return res.status(200).json(cart);
    }

    // New cart for the user
    const newCart = new Cart({ userId, items });
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);

  } catch (err) {
    res.status(500).json({ message: 'Error saving cart', error: err.message });
  }
};

// ✅ Get cart by userId
export const getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(200).json({ userId: req.params.userId, items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// ✅ Delete item from cart
export const deleteCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item =>
      item.title.trim().toLowerCase() !== title.trim().toLowerCase()
    );

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};

// ✅ New: Update quantity of item in cart
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(i =>
      i.title.trim().toLowerCase() === title.trim().toLowerCase()
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: 'Error updating item quantity', error: err.message });
  }
};



// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = []; // clear items
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};
