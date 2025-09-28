const express = require("express");
const router = express.Router();
const Criterion = require("../models/Criterion");

// GET all criteria
router.get("/", async (req, res) => {
  try {
    const criteria = await Criterion.find().sort({ criterionNumber: 1 });
    res.json(criteria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE new criterion
router.post("/", async (req, res) => {
  try {
    const { criterionNumber, title, link } = req.body;
    const newCriterion = new Criterion({ criterionNumber, title, link });
    await newCriterion.save();
    res.json(newCriterion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE criterion
router.put("/:id", async (req, res) => {
  try {
    const { criterionNumber, title, link } = req.body;
    const updated = await Criterion.findByIdAndUpdate(
      req.params.id,
      { criterionNumber, title, link },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE criterion
router.delete("/:id", async (req, res) => {
  try {
    await Criterion.findByIdAndDelete(req.params.id);
    res.json({ message: "Criterion deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// GET summary: total links per criterion
router.get("/summary", async (req, res) => {
  try {
    // Group by criterionNumber and count total links
    const summary = await Criterion.aggregate([
      {
        $group: {
          _id: "$criterionNumber",
          totalLinks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // sort ascending
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all links for a specific criterion
router.get("/:number/links", async (req, res) => {
  try {
    const number = parseInt(req.params.number);
    const links = await Criterion.find({ criterionNumber: number }).sort({ sno: 1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
