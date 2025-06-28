import { Router } from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", authenticateToken, createProject); // Protected
router.put("/:id", authenticateToken, updateProject); // Protected
router.delete("/:id", authenticateToken, deleteProject); // Protected

export default router;