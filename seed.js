// backend/seed.js
const mongoose = require("mongoose");
require("dotenv").config();
const Criterion = require("./models/Criterion");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const criteriaData = [
  { criterionNumber: 1, title: "Profile of the Institution", link: "https://example.com/criterion1" },
  { criterionNumber: 1, title: "Vision & Mission", link: "https://example.com/criterion1" },
  { criterionNumber: 2, title: "Teaching-Learning Process", link: "https://example.com/criterion2" },
  { criterionNumber: 3, title: "Research and Innovations", link: "https://example.com/criterion3" },
  { criterionNumber: 4, title: "Infrastructure", link: "https://example.com/criterion4" },
  { criterionNumber: 5, title: "Student Support", link: "https://example.com/criterion5" },
  { criterionNumber: 6, title: "Governance", link: "https://example.com/criterion6" },
  { criterionNumber: 7, title: "Institutional Values", link: "https://example.com/criterion7" },
];

Criterion.insertMany(criteriaData)
  .then(() => {
    console.log("Data seeded");
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));
