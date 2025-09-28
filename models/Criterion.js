const mongoose = require("mongoose");

const criterionSchema = new mongoose.Schema({
  criterionNumber: { type: Number, required: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
});

module.exports = mongoose.model("Criterion", criterionSchema);
