import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDb } from "./db.js";

// Import Routes
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import skillRoutes from "./routes/skills.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
  res.send("Portfolio Backend is operational!");
});

// Use API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);

// Database initialization and server start
(async () => {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.stack);
    process.exit(1);
  }
})();