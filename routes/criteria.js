const express = require("express");
const router = express.Router();
const Criterion = require("../models/Criterion");
const verifyAdmin = require("../middleware/auth");

// GET all criteria (for homepage)
router.get("/", async (req, res) => {
  try {
    // Fetch all unique criterion numbers and sort ascending
    const criteria = await Criterion.find().distinct("criterionNumber");

    // Sort numbers ascending
    criteria.sort((a, b) => a - b);

    res.json(criteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET details of a specific criterion
router.get("/:number", async (req, res) => {
  try {
    const number = parseInt(req.params.number);
    const details = await Criterion.find({ criterionNumber: number });
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Protected Route - Add criterion (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { criterionNumber, title, link } = req.body;
    const newCriterion = new Criterion({ criterionNumber, title, link });
    await newCriterion.save();
    res.status(201).json(newCriterion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Protected Route - Update criterion (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Criterion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔒 Protected Route - Delete criterion (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Criterion.findByIdAndDelete(req.params.id);
    res.json({ message: "Criterion deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
