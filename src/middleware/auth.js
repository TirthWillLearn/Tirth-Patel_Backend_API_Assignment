const jwt = require("jsonwebtoken");
const pool = require("../db");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request (basic info)
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorizeRole = (roles = []) => {
  // roles may be string or array
  if (typeof roles === "string") roles = [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};

module.exports = { authenticate, authorizeRole };
