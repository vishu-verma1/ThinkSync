import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userService.createUser({ email, password });

    // Ensure user is created successfully
    if (!user) {
      return res.status(500).json({ error: "User creation failed" });
    }

    // Generating token for user Authentication
    const token = await user.generateJWT();
    delete user._doc.password; 
    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error in createUserController:", error);

    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export const loginUserController = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Select the password field explicitly
    const user = await userModel.findOne({ email }).select("+password");

    // If user not found in db
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // Generating token for user Authentication
    const token = await user.generateJWT();

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error in loginUserController:", error);

    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export const getProfileUserController = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

export const logoutUserController = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(201).json({ message: "logout Successfully  " });
  } catch (error) {
    console.error("Error in logoutUserController:", error);

    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
