const express = require("express");
const router = express.Router();
const Criterion = require("../models/Criterion");
const verifyAdmin = require("../middleware/auth");

// GET all criteria (for homepage) in ascending order
router.get("/", async (req, res) => {
  try {
    // Fetch all criteria, select only criterionNumber and name
    const criteria = await Criterion.find({}, { _id: 0, criterionNumber: 1, name: 1 })
      .sort({ criterionNumber: 1 }); // ascending order

    //  remove duplicates if multiple entries per criterionNumber exist
    const uniqueCriteria = [];
    const seen = new Set();
    for (const c of criteria) {
      if (!seen.has(c.criterionNumber)) {
        seen.add(c.criterionNumber);
        uniqueCriteria.push(c);
      }
    }

    res.json(uniqueCriteria);
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
