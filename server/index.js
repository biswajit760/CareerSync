const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ✅ Connect to database
connectDB();

// ✅ Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerSync API is running",
  });
});

// ================= ROUTES =================

// 🔐 Auth
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🧠 MAIN ANALYZE ROUTE
const analyzeRoutes = require("./routes/analyze.routes");
app.use("/api/analyze", analyzeRoutes);

// 📊 ATS REPORT
const atsRoutes = require("./routes/ats.routes");
app.use("/api/ats", atsRoutes);

// 📄 RESUME (History)
const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/resume", resumeRoutes);

// 💼 JOB MATCHING (🆕 NEW ROUTE)
const jobRoutes = require("./routes/job.routes");
app.use("/api/jobs", jobRoutes);



app.get("/test-error", (req, res, next) => {
  next(new AppError("Test error working", 400));
});

// ================= ERROR HANDLING =================

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);



const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");
app.use(errorHandler);