import { body } from "express-validator";

export const validateProject = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3 })
    .withMessage("Project name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Project name must not exceed 50 characters"),
];

export const validateProjectUsers = [
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users array must contain at least one user"),
  body("users.*")
    .isString()
    .withMessage("Each user must be a valid string")
    .isLength({ min: 1 })
    .withMessage("Each user must not be empty"),
  body("projectId").isString().withMessage("projectId is required"),
];
