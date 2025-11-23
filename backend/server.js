import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import analyticsRoutes from "./routes/analytics.js";
import shoeRoutes from "./routes/shoes.js";
import {
  securityHeaders,
  sanitizeInput,
  requestSizeLimit,
  authRateLimiter,
  apiRateLimiter,
} from "./middleware/security.js";

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware
app.use(securityHeaders);
app.use(requestSizeLimit);
app.use(sanitizeInput);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://brand-analytics-dashboard-one.vercel.app",
            "https://brand-analytics-dashboard-mayuresh-dalvis-projects.vercel.app",
          ]
        : ["http://localhost:3000"],
    credentials: true,
  })
);

// Body parsing middleware with limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Rate limiting
app.use("/api/auth/login", authRateLimiter);
app.use("/api/", apiRateLimiter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running with enhanced security",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/shoes", shoeRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // JWT error
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: error.message }),
  });
});

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/brand-analytics",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5176;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} with enhanced security`);
  console.log(
    `🔒 Security features: Rate limiting, Input validation, XSS protection`
  );
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});
