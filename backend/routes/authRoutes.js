import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/authController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// * user registration

router.post("/register", registerUser);

// * user login
router.post("/login", loginUser);

// * user logout
router.post("/logout", protectedRoute, logoutUser);

router.get("/me", protectedRoute, getMe);

export default router;
