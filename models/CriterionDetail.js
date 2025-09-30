// models/CriterionDetail.js
const mongoose = require("mongoose");

const criterionDetailSchema = new mongoose.Schema(
  {
    criterion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Criterion",
      required: true,
    },

    serialNumber: { type: String, required: true }, 

    title: { type: String, required: true }, 

    link: { type: String, required: true }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("CriterionDetail", criterionDetailSchema);
