const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/seller");
const Student = require("../models/student");

const router = express.Router(); // ✅ FIXED: Initialize Router

// ✅ Seller Signup Route
router.post("/seller-signup", async (req, res) => {
  try {
    const {
      store_name,
      name,
      email,
      password,
      contactNumber,
      pincode,
      street,
      city,
      state,
      open24,
      openingTime,
      closingTime,
    } = req.body;

    // Check if email is already registered
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Validate Operating Hours
    let operatingHours;
    if (open24) {
      operatingHours = { open24: true }; // Store only `open24`
    } else {
      if (!openingTime || !closingTime) {
        return res.status(400).json({
          error: "Opening and Closing times are required if not open 24/7.",
        });
      }
      operatingHours = { open24: false, openingTime, closingTime };
    }

    const seller = new Seller({
      store_name,
      name,
      email,
      password: hashedPassword,
      contactNumber,
      address: { pincode, street, city, state },
      operatingHours,
    });

    await seller.save();
    res.status(201).json({ message: "Seller registered successfully!" });
  } catch (err) {
    console.error("Seller Signup Error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});

// ✅ Student Signup Route
router.post("/student-signup", async (req, res) => {
  try {
    const {
      collegeId,
      name,
      email,
      password,
      contactNumber,
      pincode,
      street,
      city,
      state,
    } = req.body;

    // Check for existing email or collegeId
    const existingStudent = await Student.findOne({ email });
    if (existingStudent)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      collegeId,
      name,
      email,
      password: hashedPassword,
      contactNumber,
      address: { pincode, street, city, state },
    });

    await student.save();
    res.status(201).json({ message: "Student registered successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🛠 Log the received request data
    console.log("🔹 Received Login Request:");
    console.log("   Email:", email);
    console.log("   Role:", role);

    // Check if role is provided & valid
    if (!role || (role !== "seller" && role !== "student")) {
      console.error("❌ Invalid role detected:", role);
      return res
        .status(400)
        .json({ error: "Invalid role. Must be 'seller' or 'student'." });
    }

    // Select the correct model
    const User = role === "seller" ? Seller : Student;
    console.log("🔍 Searching in:", role);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.error("❌ User not found!");
      return res.status(400).json({ error: "User not found!" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("❌ Invalid password!");
      return res.status(400).json({ error: "Invalid credentials!" });
    }

    // Check if JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment variables!");
      return res
        .status(500)
        .json({ error: "Server configuration error. Contact admin." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("✅ Login Successful for:", user.name);

    // Send response
    res.json({
      message: "Login successful!",
      token,
      user: {
        name: user.name,
        email: user.email,
        role,
        operatingHours: user.operatingHours || null,
      },
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Servers Error" });
  }
});
module.exports = router;
