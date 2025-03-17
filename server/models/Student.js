const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    collegeId: { type: String, required: true, unique: true },
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
  },
  { timestamps: true }
);

// Use existing model if it exists, otherwise create a new one
const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

module.exports = Student; // Export only once
