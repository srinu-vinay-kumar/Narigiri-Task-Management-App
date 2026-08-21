import express from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getWeather,
  updateTask,
} from "../controllers/taskController.js";
import { protectedRoute } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// * create task
router.post("/", protectedRoute, upload.single("file"), createTask);

// * read users' tasks
router.get("/", protectedRoute, getTasks);

router.get("/weather", protectedRoute, getWeather);

// * read each task
router.get("/:id", protectedRoute, getTaskById);

// * update task
router.put("/:id", protectedRoute, upload.single("file"), updateTask);

// * delete task
router.delete("/:id", protectedRoute, deleteTask);

export default router;
