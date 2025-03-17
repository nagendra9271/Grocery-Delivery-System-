const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Order = require("../models/Order");

// ✅ Get all orders for a seller
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.user.id; // Seller's ID from JWT

    const orders = await Order.find({ sellerId })
      .populate("productId", "name images price") // ✅ Correct field name
      .populate("studentId", "name email") // ✅ Also fetch student details
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Update order status (Processing → Shipped → Delivered)
router.put("/:orderId/status", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const sellerId = req.user.id;

    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update." });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, sellerId },
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ error: "Order not found or not authorized." });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully!", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET: Fetch Completed Orders for Seller
router.get("/completed", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.user.id; // Get seller ID from JWT

    const orders = await Order.find({
      sellerId,
      status: "Delivered", // ✅ Only fetch completed orders
    })
      .populate("productId", "name") // ✅ Get product details
      .sort({ updatedAt: -1 }); // ✅ Show newest orders first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
