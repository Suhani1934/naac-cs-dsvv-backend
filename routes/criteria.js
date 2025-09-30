const express = require("express");
const router = express.Router();
const Criterion = require("../models/Criterion");
const CriterionDetail = require("../models/CriterionDetail");
const verifyAdmin = require("../middleware/auth");

// -----------------------------
// CRITERION ROUTES
// -----------------------------

// GET all criteria (homepage) - unique by criterionNumber
router.get("/", async (req, res) => {
  try {
    const criteria = await Criterion.find().sort({ criterionNumber: 1 });

    // Remove duplicates
    const unique = Array.from(
      new Map(criteria.map((c) => [c.criterionNumber, c])).values()
    );

    res.json(unique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add Criterion (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { criterionNumber, name } = req.body;
    const newCriterion = new Criterion({ criterionNumber, name });
    await newCriterion.save();
    res.status(201).json(newCriterion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update Criterion
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await Criterion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete Criterion
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Criterion.findByIdAndDelete(req.params.id);
    res.json({ message: "Criterion deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// CRITERION DETAIL ROUTES
// -----------------------------

// GET all details for a criterion
router.get("/:criterionNumber/details", async (req, res) => {
  try {
    const number = parseInt(req.params.criterionNumber);
    const details = await CriterionDetail.find({ criterionNumber: number }).sort({ createdAt: 1 });
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add new detail to criterion (Admin only)
router.post("/detail", verifyAdmin, async (req, res) => {
  try {
    const { criterionNumber, serialNumber, title, link } = req.body;
    const newDetail = new CriterionDetail({ criterionNumber, serialNumber, title, link });
    await newDetail.save();
    res.status(201).json(newDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update criterion detail (Admin only)
router.put("/detail/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await CriterionDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete criterion detail (Admin only)
router.delete("/detail/:id", verifyAdmin, async (req, res) => {
  try {
    await CriterionDetail.findByIdAndDelete(req.params.id);
    res.json({ message: "Criterion detail deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
