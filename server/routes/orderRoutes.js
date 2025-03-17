const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const Order = require("../models/Order");

// ✅ Get all orders for a student (with "Booked On" date)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.id;
    const orders = await Order.find({ studentId })
      .populate("productId", "name images price")
      .sort({ createdAt: -1 }); // Show latest orders first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get a single order by ID (with "Booked On" date)
router.get("/:orderId", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const studentId = req.user.id;

    const order = await Order.findOne({ _id: orderId, studentId }).populate(
      "productId",
      "name images price"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Cancel an order (if it's still pending or processing)
router.put("/:orderId/cancel", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const studentId = req.user.id;

    // ✅ Find and update order if it's still cancelable
    const order = await Order.findOneAndUpdate(
      { _id: orderId, studentId, status: { $in: ["Pending", "Processing"] } },
      { status: "Cancelled" },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ error: "Order cannot be cancelled." });
    }

    res.status(200).json({ message: "Order cancelled successfully!", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
