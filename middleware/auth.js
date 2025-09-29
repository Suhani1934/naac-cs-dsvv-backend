// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Access denied, no token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    req.admin = decoded; // store admin details in req
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = verifyAdmin;
