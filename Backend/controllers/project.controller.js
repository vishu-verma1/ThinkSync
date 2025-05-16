import { validationResult } from "express-validator";
import * as projectService from "../services/project.service.js";
import userModel from "../models/user.model.js";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description } = req.body;
    const userId = req.user._id;
    const newProject = await projectService.createProject({ name, userId });
    res.status(201).json({
      message: "Project has been created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error in createProjectController:", error);
    if (error.message.includes("project name must be unique")) {
      return res.status(400).json({
        error: "Project name already exists and project name must be unique",
      });
    }
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const getProjectController = async (req, res) => {
  try {
    const loggedInuserId = req.user._id;

    const allUseProject = await projectService.getAllProjectByUserId({
      loggedInuserId,
    });
    res.status(201).json({
      message: "Projects fetched successfully",
      Projects: allUseProject,
    });
  } catch (error) {
    console.error("Error in getProjectController:", error);

    if (error.message.includes("User id is required")) {
      return res.status(400).json({ error: "User Id is required" });
    }

    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const addUserToProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;
    const loggedInUser = await userModel.findOne({
      _id: req.user._id,
    });

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Error in addUserToProjectController:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await projectService.getProjectById(projectId);
    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error in getUserByIdController:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

export const deleteProjectController = async (req, res) => {
  const { projectId } = req.params;

  try {
    const userId = req.user._id; 
    await projectService.deleteProject({ projectId, userId });

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProjectController:", error);

    if (error.message.includes("Project not found")) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({ error: "Unauthorized to delete this project" });
    }

    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};