const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // Ensures no negative price
    images: { type: [String], default: ["/images/default_product.png"] }, // Default image
    category: { type: String, required: true, trim: true },
    inventory: { type: Number, required: true, min: 0 }, // Ensures stock can't be negative
    isActive: { type: Boolean, default: true }, // Soft delete option
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
