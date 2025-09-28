const express = require("express");
const router = express.Router();
const Criterion = require("../models/Criterion");

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


module.exports = router;
