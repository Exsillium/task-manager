require("dotenv").config();
const db = require("./db");
const authRoutes = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");


const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});


const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed a protected route 🎉",
    user: req.user,
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
