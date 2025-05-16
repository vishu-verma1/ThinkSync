import mongoose from "mongoose";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Name is required");
  }
  if (!userId) {
    throw new Error("User id is required");
  }
  try {
    const project = await projectModel.create({
      name,
      users: [userId],
    });

    return project;
  } catch (error) {
    console.error("Error creating project:", error);
    if (error.message.includes("project name must be unique")) {
      throw new Error("project name must be unique");
    }

    throw new Error("Internal Server Error. Please try again later.");
  }
};

export const getAllProjectByUserId = async ({ loggedInuserId }) => {
  if (!loggedInuserId) {
    throw new Error("User id is required");
  }

  try {
    const allUserProjects = await projectModel.find({
      users: loggedInuserId,
    });

    return allUserProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Internal Server Error. Please try again later.");
  }
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!userId) {
    throw new Error("userId is required");
  }

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new Error("invailid projectId or userid");
  }

  if (!users) {
    throw new Error("Users are required");
  }
  if (
    !Array.isArray(users) ||
    users.some((userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userid");
      }
      return false;
    })
  ) {
    throw new Error("Invalid users array");
  }
  try {
    const project = await projectModel.findOne({
      _id: projectId,
      users: userId,
    });

    if (!project) {
      throw new Error("user not belong to the this poroject");
    }

    const updatedProject = await projectModel.findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        $addToSet: {
          users: {
            $each: users,
          },
        },
      },
      { new: true }
    );

    return updatedProject;
  } catch (error) {
    console.error("Error in adding user to the projects:", error);
    throw new Error("Internal Server Error. Please try again later.");
  }
};

export const getProjectById = async (projectId) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("invalid proojectId");
  }

  const project = await projectModel
    .findOne({
      _id: projectId,
    })
    .populate("users");

  return project;
};


export const deleteProject = async ({ projectId, userId }) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  try {
    const project = await projectModel.findOne({ _id: projectId });

    if (!project) {
      throw new Error("Project not found");
    }

    // Check if the user is authorized to delete the project
    if (!project.users.includes(userId)) {
      throw new Error("Unauthorized");
    }

    await projectModel.deleteOne({ _id: projectId });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    throw new Error("Internal Server Error. Please try again later.");
  }
};