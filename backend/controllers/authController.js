import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc        Register a user
// @route       POST /api/auth/register
// @access      Public

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data received");
  }
});

// @desc        login user / generate cookie
// @route       POST /api/auth/login
// @access      Public

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser && (await existingUser.matchPassword(password))) {
    generateToken(res, existingUser._id);

    res.status(200).json({
      message: "user logged in successfully",
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password!");
  }
});

// @desc        logout user / clear cookie
// @route       POST /api/auth/logout
// @access      Private (Must be logged in to loguot)

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  res
    .status(200)
    .json({ message: "User loggout successfully", email: req.user.email });
});

// @desc    Get current logged in user data
// @route   GET /auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "User verified",
    user: req.user,
  });
});
