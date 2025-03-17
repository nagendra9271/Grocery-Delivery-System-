const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Protect Routes
const Product = require("../models/product");
const Order = require("../models/Order");
const Seller = require("../models/seller"); // ✅ FIXED: Import Seller Model
const Discount = require("../models/discount"); // ✅ Import Discount Model

// ✅ GET SELLER DASHBOARD DATA
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    res.json(seller);
  } catch (error) {
    console.error("Error fetching seller data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ ADD A NEW PRODUCT
router.post("/add-product", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, inventory, images } = req.body;

    if (!name || !price || !category || inventory === undefined)
      return res.status(400).json({ error: "All fields are required" });

    const product = new Product({
      sellerId: req.user.id,
      name,
      description,
      price,
      category,
      inventory,
      images,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ VIEW SELLER'S PRODUCTS
router.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/edit-product/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, inventory, images } = req.body;
    const product = await Product.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.inventory = inventory !== undefined ? inventory : product.inventory;
    product.images = images || product.images;

    await product.save();
    res.json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/toggle-active/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { isActive } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive }, // ✅ Instead of deleting, set isActive to false
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product marked as inactive.", product });
  } catch (error) {
    console.error("Error inactivating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ MARK ORDER AS COMPLETED
router.put("/complete-order/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "Completed";
    await order.save();
    res.json({ message: "Order marked as completed!" });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ VIEW COMPLETED ORDERS
router.get("/completed-orders", authMiddleware, async (req, res) => {
  try {
    const completedOrders = await Order.find({
      sellerId: req.user.id,
      status: "Completed",
    });
    res.json(completedOrders);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ CREATE A DISCOUNT
router.post("/add-discount", authMiddleware, async (req, res) => {
  try {
    const { code, discountType, discountValue, validFrom, validUntil } =
      req.body;

    if (!code || !discountType || !discountValue || !validFrom || !validUntil)
      return res.status(400).json({ error: "All fields are required" });

    const existingDiscount = await Discount.findOne({
      code,
      sellerId: req.user.id,
    });
    if (existingDiscount)
      return res.status(400).json({ error: "Discount code already exists" });

    const discount = new Discount({
      sellerId: req.user.id,
      code,
      discountType,
      discountValue,
      validFrom,
      validUntil,
    });

    await discount.save();
    res.status(201).json({ message: "Discount created successfully!" });
  } catch (error) {
    console.error("Error creating discount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET ALL DISCOUNTS
router.get("/discounts", authMiddleware, async (req, res) => {
  try {
    const discounts = await Discount.find({ sellerId: req.user.id });
    res.json(discounts);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ DELETE A DISCOUNT
router.delete("/discount/:id", authMiddleware, async (req, res) => {
  try {
    const discount = await Discount.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user.id,
    });

    if (!discount) return res.status(404).json({ error: "Discount not found" });

    res.json({ message: "Discount deleted successfully!" });
  } catch (error) {
    console.error("Error deleting discount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
