const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ GET: Fetch Cart Items
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ studentId: req.user._id }).populate(
      "products.productId"
    );

    if (!cart) return res.json({ products: [], totalAmount: 0 });

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST: Add Product to Cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid product ID or quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.isActive) {
      return res.status(400).json({
        error: "This product is inactive and cannot be added to the cart.",
      });
    }

    if (quantity > product.inventory) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ studentId: req.user.id });

    if (!cart) {
      cart = new Cart({
        studentId: req.user.id,
        products: [],
        totalAmount: 0,
      });
    }

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price: product.price });
    }

    cart.totalAmount = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    await cart.save();
    res.json({ message: "Product added to cart!", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ PUT: Update Quantity in Cart
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ studentId: req.user.id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (productIndex === -1)
      return res.status(404).json({ error: "Product not in cart" });

    if (quantity < 1)
      return res.status(400).json({ error: "Quantity must be at least 1" });

    cart.products[productIndex].quantity = quantity;
    cart.totalAmount = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ DELETE: Remove Product from Cart
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ studentId: req.user.id });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId
    );
    cart.totalAmount = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    await cart.save();
    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Buy selected items from the cart
router.post("/buy-selected", authMiddleware, async (req, res) => {
  try {
    const { selectedProducts } = req.body;
    const studentId = req.user.id;

    if (!selectedProducts || selectedProducts.length === 0) {
      return res
        .status(400)
        .json({ error: "No products selected for purchase." });
    }

    const selectedProductIds = selectedProducts.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const cart = await Cart.findOne({ studentId }).populate(
      "products.productId"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ error: "Cart is empty or not found." });
    }

    const orderPromises = [];

    for (const item of cart.products) {
      if (!item.productId) {
        return res.status(400).json({ error: "Invalid product in cart." });
      }

      if (!item.productId.isActive) {
        return res.status(400).json({
          error: `The product "${item.productId.name}" is inactive and cannot be purchased.`,
        });
      }

      if (selectedProductIds.some((id) => id.equals(item.productId._id))) {
        if (item.quantity > item.productId.inventory) {
          return res.status(400).json({
            error: `Not enough stock for ${item.productId.name}. Available: ${item.productId.inventory}`,
          });
        }

        const order = new Order({
          studentId,
          sellerId: item.productId.sellerId,
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          totalAmount: item.quantity * item.productId.price,
          status: "Pending",
          paymentDetails: {
            paymentId: `PAY-${new Date().getTime()}`,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending",
          },
        });

        orderPromises.push(order.save());

        await Product.findByIdAndUpdate(
          item.productId._id,
          { $inc: { inventory: -item.quantity } },
          { new: true }
        );
      }
    }

    if (orderPromises.length === 0) {
      return res.status(400).json({ error: "No valid products to purchase." });
    }

    const orders = await Promise.all(orderPromises);

    cart.products = cart.products.filter(
      (item) => !selectedProductIds.some((id) => id.equals(item.productId._id))
    );
    await cart.save();

    res.status(200).json({ message: "Orders placed successfully!", orders });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ POST: Checkout (Clear Cart)
router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ studentId: req.user.id });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    cart.products = [];
    cart.totalAmount = 0;

    await cart.save();
    res.json({ message: "Checkout successful. Your order has been placed." });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
