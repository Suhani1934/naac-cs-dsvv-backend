// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Criterion = require("../models/Criterion");
const CriterionDetail = require("../models/CriterionDetail");
const verifyAdmin = require("../middleware/auth");

// Admin Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Stats - Get all criteria with link counts
router.get("/dashboard/stats", verifyAdmin, async (req, res) => {
  try {
    // Get unique criterion numbers sorted ascending
    const numbers = await Criterion.distinct("criterionNumber");
    numbers.sort((a, b) => a - b);

    const data = await Promise.all(
      numbers.map(async (num) => {
        const criterion = await Criterion.findOne(
          { criterionNumber: num },
          { _id: 1, criterionNumber: 1, name: 1 }
        );

        const count = await CriterionDetail.countDocuments({ criterionNumber: num });

        return {
          _id: criterion._id,
          criterionNumber: criterion.criterionNumber,
          name: criterion.name,
          linkCount: count,
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
