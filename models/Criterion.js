const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema(
  {
    criterionNumber: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Criterion", criterionSchema);