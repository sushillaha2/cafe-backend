import express from "express";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

//   Dashboard summary
router.get("/dashboard", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const customers = await User.countDocuments({ role: "customer" });

    // revenue from "total"
    const revenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    // best seller from items array (using items.name)
    const bestSeller = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      totalOrders,
      customers,
      revenue: revenue[0]?.total || 0,
      bestSeller: bestSeller[0]?._id || "N/A"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//   Customer list
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("name email status");
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//   Delete customer
router.delete("/customers/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//   Block / Unblock customer
router.put("/customers/:id/block", async (req, res) => {
  const user = await User.findById(req.params.id);
  user.status = user.status === "blocked" ? "active" : "blocked";
  await user.save();
  res.json({ success: true, status: user.status });
});

//   Recent Orders list
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")   // userId ref se naam aur email
      .sort({ createdAt: -1 })           // latest orders first
      .limit(10);                        // sirf last 10 orders

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


