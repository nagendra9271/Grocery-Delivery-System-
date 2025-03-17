const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    store_name: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    address: {
      pincode: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
    },
    operatingHours: {
      open24: { type: Boolean, default: false },
      openingTime: {
        type: String,
        required: function () {
          return !this.operatingHours.open24;
        }, // Required only if NOT Open 24/7
      },
      closingTime: {
        type: String,
        required: function () {
          return !this.operatingHours.open24;
        }, // Required only if NOT Open 24/7
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
