const mongoose = require("mongoose");

const subHeadingSchema = new mongoose.Schema({
  serialNumber: { type: String, required: true },   
  title: { type: String, required: true },
  link: { type: String, required: true },
});

const criterionDetailSchema = new mongoose.Schema(
  {
    criterion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Criterion",
      required: true,
    },
    mainSerialNumber: { type: String, required: true }, 
    mainTitle: { type: String, required: true },     
    subHeadings: [subHeadingSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CriterionDetail", criterionDetailSchema);
