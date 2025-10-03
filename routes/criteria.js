// routes/criteria.js
const express = require("express");
const router = express.Router();
const Criterion = require("../models/Criterion");
const CriterionDetail = require("../models/CriterionDetail");
const verifyAdmin = require("../middleware/auth");

// GET all criteria (with linkCount)
router.get("/", async (req, res) => {
  try {
    const criteria = await Criterion.find().sort({ criterionNumber: 1 });

    // count total subHeadings for each criterion
    const withCounts = await Promise.all(
      criteria.map(async (crit) => {
        const details = await CriterionDetail.find({ criterion: crit._id });
        let count = 0;
        details.forEach((d) => {
          count += d.subHeadings.length;
        });
        return { ...crit.toObject(), linkCount: count };
      })
    );

    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add Criterion
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { criterionNumber, name } = req.body;

    if (!criterionNumber || !name) {
      return res
        .status(400)
        .json({ error: "Criterion number and name are required" });
    }

    // Convert to number
    const critNum = Number(criterionNumber);
    if (isNaN(critNum)) {
      return res
        .status(400)
        .json({ error: "Criterion number must be a number" });
    }

    // Check for duplicate
    const existing = await Criterion.findOne({ criterionNumber: critNum });
    if (existing) {
      return res.status(400).json({ error: "Criterion number already exists" });
    }

    const newCriterion = new Criterion({ criterionNumber: critNum, name });
    await newCriterion.save();
    res.status(201).json(newCriterion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update Criterion
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { criterionNumber, name } = req.body;

    if (!criterionNumber || !name) {
      return res
        .status(400)
        .json({ error: "Criterion number and name are required" });
    }

    const updated = await Criterion.findByIdAndUpdate(
      req.params.id,
      { criterionNumber: Number(criterionNumber), name },
      { new: true }
    );

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

// GET all details for a criterion
router.get("/:criterionNumber/details", async (req, res) => {
  try {
    const criterion = await Criterion.findOne({
      criterionNumber: req.params.criterionNumber,
    });
    if (!criterion) {
      return res.status(404).json({ error: "Criterion not found" });
    }

    const details = await CriterionDetail.find({
      criterion: criterion._id,
    }).sort({
      createdAt: 1,
    });

    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add new main heading to criterion
router.post("/detail", verifyAdmin, async (req, res) => {
  try {
    const { criterionNumber, mainSerialNumber, mainTitle } = req.body;

    if (!criterionNumber || !mainSerialNumber || !mainTitle) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const criterion = await Criterion.findOne({ criterionNumber });
    if (!criterion)
      return res.status(404).json({ error: "Criterion not found" });

    const newDetail = new CriterionDetail({
      criterion: criterion._id,
      mainSerialNumber,
      mainTitle,
      subHeadings: [],
    });

    await newDetail.save();
    res.status(201).json(newDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update a main heading
router.put("/detail/:id", verifyAdmin, async (req, res) => {
  try {
    const updated = await CriterionDetail.findByIdAndUpdate(
      req.params.id,
      {
        mainSerialNumber: req.body.mainSerialNumber,
        mainTitle: req.body.mainTitle,
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete a main heading (with all subHeadings)
router.delete("/detail/:id", verifyAdmin, async (req, res) => {
  try {
    await CriterionDetail.findByIdAndDelete(req.params.id);
    res.json({ message: "Criterion detail deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Add sub-heading inside a main heading
router.post("/detail/:id/sub", verifyAdmin, async (req, res) => {
  try {
    const { serialNumber, title, link } = req.body;

    const detail = await CriterionDetail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ error: "Main heading not found" });
    }

    detail.subHeadings.push({ serialNumber, title, link });
    await detail.save();

    res.status(201).json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update sub-heading
router.put("/detail/:id/sub/:subId", verifyAdmin, async (req, res) => {
  try {
    const { serialNumber, title, link } = req.body;

    const detail = await CriterionDetail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ error: "Main heading not found" });
    }

    const sub = detail.subHeadings.id(req.params.subId);
    if (!sub) {
      return res.status(404).json({ error: "Sub-heading not found" });
    }

    sub.serialNumber = serialNumber;
    sub.title = title;
    sub.link = link;

    await detail.save();
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Remove a sub-heading
router.delete("/detail/:id/sub/:subId", verifyAdmin, async (req, res) => {
  try {
    const detail = await CriterionDetail.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ error: "Main heading not found" });
    }

    detail.subHeadings = detail.subHeadings.filter(
      (s) => s._id.toString() !== req.params.subId
    );

    await detail.save();
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
