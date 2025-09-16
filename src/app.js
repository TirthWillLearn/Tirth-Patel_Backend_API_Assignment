const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// error handler (last)
app.use(errorHandler);

module.exports = app;
