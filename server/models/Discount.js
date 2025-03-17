const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["Percentage", "Fixed"], required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Discount", discountSchema);
