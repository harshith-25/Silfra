import { Router } from "express";
import {
  submitMessage,
  getAllMessages,
  deleteMessage,
} from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", submitMessage); // Public (for website visitors)
router.get("/", authenticateToken, getAllMessages); // Protected
router.delete("/:id", authenticateToken, deleteMessage); // Protected

export default router;