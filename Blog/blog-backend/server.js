import express from "express";
import cors from "cors";
import { initializeDb } from "./db.js";
import postsRouter from "./routes/posts.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blog Backend is operational!");
});

app.use("/api/posts", postsRouter);

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