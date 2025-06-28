import { Router } from "express";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllSkills);
router.post("/", authenticateToken, createSkill); // Protected
router.put("/:id", authenticateToken, updateSkill); // Protected
router.delete("/:id", authenticateToken, deleteSkill); // Protected

export default router;