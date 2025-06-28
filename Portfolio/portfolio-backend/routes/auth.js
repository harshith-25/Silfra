import { Router } from "express";
import { login, signup } from "../controllers/authController.js"; // Import signup

const router = Router();

router.post("/login", login);
router.post("/signup", signup); // New signup route

export default router;