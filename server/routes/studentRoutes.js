const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Student = require("../models/student");
const Product = require("../models/product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// ✅ Get Student Dashboard Data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) return res.status(404).json({ error: "Student not found" });

    // ✅ Get order count
    const orderCount = await Order.countDocuments({ studentId: req.user.id });

    // ✅ Get cart count
    const cart = await Cart.findOne({ studentId: req.user.id });
    const cartCount = cart ? cart.products.length : 0;

    res.json({
      name: student.name,
      email: student.email,
      contactNumber: student.contactNumber,
      orderCount,
      cartCount,
    });
  } catch (error) {
    console.error("Error fetching student dashboard data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all products with seller name, pagination, search & filtering
router.get("/products", async (req, res) => {
  try {
    let { page, limit, category, search, sortBy, order } = req.query;

    // Convert query params to numbers
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let query = { isActive: true }; // ✅ Only fetch active products

    // ✅ Filter by category
    if (category) {
      query.category = category;
    }

    // ✅ Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Sort by price, name, or date added
    let sortQuery = {};
    if (sortBy) {
      sortQuery[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sortQuery["createdAt"] = -1; // Default: Newest first
    }

    // ✅ Fetch products with seller name
    const products = await Product.find(query)
      .populate("sellerId", "store_name")
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    // ✅ Total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Student Cart
router.get("/cart", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ studentId: req.user.id }).populate(
      "products.productId"
    );
    res.json(cart || { products: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/buy-now", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const studentId = req.user.id; // Extract from JWT

    // ✅ Validate input
    if (!productId || quantity < 1) {
      return res.status(400).json({ error: "Invalid product ID or quantity." });
    }

    // ✅ Fetch product details
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: "Product not found or inactive." });
    }

    // ✅ Check inventory
    if (quantity > product.inventory) {
      return res.status(400).json({
        error: `Not enough stock available. Only ${product.inventory} left.`,
      });
    }

    // ✅ Create order
    const order = new Order({
      studentId,
      sellerId: product.sellerId,
      productId: product._id,
      quantity,
      price: product.price,
      totalAmount: quantity * product.price,
      status: "Pending",
      paymentDetails: {
        paymentId: `PAY-${new Date().getTime()}`, // Dummy payment ID
        paymentMethod: "Cash on Delivery", // Can be modified later
        paymentStatus: "Pending",
      },
    });

    await order.save();

    // ✅ Reduce inventory
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { inventory: -quantity } },
      { new: true }
    );

    res.status(200).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Place Order
router.post("/order/place", authMiddleware, async (req, res) => {
  try {
    const { deliverySlot } = req.body;
    const cart = await Cart.findOne({ studentId: req.user.id }).populate(
      "products.productId"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty!" });
    }

    const totalAmount = cart.products.reduce(
      (sum, p) => sum + p.productId.price * p.quantity,
      0
    );

    const order = new Order({
      studentId: req.user.id,
      sellerId: cart.products[0].productId.sellerId,
      products: cart.products,
      totalAmount,
      status: "Pending",
      deliverySlot,
    });

    await order.save();
    await Cart.deleteOne({ studentId: req.user.id });

    res.json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Order History
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ studentId: req.user.id }).populate(
      "products.productId"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Track Order Status
router.get("/order/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      studentId: req.user.id,
    }).populate("products.productId");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
