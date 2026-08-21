import asyncHandler from "express-async-handler";
import { Readable } from "stream";

import Task from "../models/Task.js";
import getWeatherByCity from "../utils/weatherService.js";
import cloudinary from "../config/cloudinary.js";
import sendEmail from "../utils/emailService.js";
// @desc        creating tasks
// @route       POST /api/tasks/
// @access      Private who logged in

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, location } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Enter required * data");
  }

  const user = req.user._id;

  //   * file upload
  let uploadedFileUrl = null;

  if (req.file) {
    uploadedFileUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "Task management app" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );
      Readable.from(req.file.buffer).pipe(uploadStream);
    });
  }
  const newTask = await Task.create({
    user,
    title,
    description,
    status,
    priority,
    dueDate,
    location,
    fileUrl: uploadedFileUrl,
  });

  const emailSent = await sendEmail(
    req.user.email,
    "New Task Created Successfully",
    `Greetings from Narigiri, Task Management App, You've successfully created the task: ${title}. Its priority is set to ${priority}.`,
  );

  res.status(201).json({ message: "Task Created.", task: newTask, emailSent });
});

// @desc        reading all tasks of a user
// @route       GET /api/tasks/
// @access      Private who logged in

export const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    search,
    startDate,
    endDate,
  } = req.query;

  const searchQuery = { user: req.user._id };

  if (status) searchQuery.status = status;
  if (priority) searchQuery.priority = priority;

  if (search) {
    searchQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (startDate || endDate) {
    searchQuery.dueDate = {};
    if (startDate) searchQuery.dueDate.$gte = new Date(startDate);
    if (endDate) searchQuery.dueDate.$lte = new Date(endDate);
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const skip = (numericPage - 1) * numericLimit;

  const [tasks, totalTasks] = await Promise.all([
    Task.find(searchQuery)
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(numericLimit),
    Task.countDocuments(searchQuery),
  ]);

  res.status(200).json({
    data: tasks,
    meta: {
      totalTasks,
      page: numericPage,
      lastPage: Math.ceil(totalTasks / numericLimit),
    },
  });
});

// @desc        reading individual task by id
// @route       GET /api/tasks/:id
// @access      Private

export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  let weather = null;
  if (task.location) {
    weather = await getWeatherByCity(task.location);
  }

  res.status(200).json({
    message: "Task retrived successfully",
    task: { ...task, weather },
  });
});

// @desc        updating a task
// @route       PUT /api/tasks/:id
// access       Private who logged in

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error("Task not existed.");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized.");
  }

  if (req.file) {
    const uploadedFileUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Task management app",
          public_id: `task_file_${id}`,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );
      Readable.from(req.file.buffer).pipe(uploadStream);
    });
    req.body.fileUrl = uploadedFileUrl;
  }

  const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  res.status(200).json({ message: "Task updated successfully", updatedTask });
});

// @desc        deleting a task
// @route       DELETE /api/tasks/:id
// access       Private who logged in

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  if (!task) {
    res.status(404);
    throw new Error("Task not existed");
  }

  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized.");
  }

  await Task.findByIdAndDelete(id);
  res.status(200).json({ message: "Task deleted" });
});

// @desc        get current weather for a location
// @route       GET /tasks/weather?city=CityName
// @access      Private

export const getWeather = asyncHandler(async (req, res) => {
  const { city } = req.query;

  if (!city) {
    res.status(400);
    throw new Error("City is required");
  }

  const weather = await getWeatherByCity(city);
  res.status(200).json({ weather });
});
