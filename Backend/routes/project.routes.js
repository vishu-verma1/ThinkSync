import { Router } from "express";
import { validateProject, validateProjectUsers } from "../validators/projectValidator.js";
import * as projectController from "../controllers/project.controller.js";
import * as userAuthMiddleware from "../middlewares/user.auth.middleware.js";
const router = Router();

router.post('/create-project',validateProject , userAuthMiddleware.isLogin, projectController.createProjectController);
router.get('/get-projects',userAuthMiddleware.isLogin, projectController.getProjectController); 
router.put('/add-user',validateProjectUsers, userAuthMiddleware.isLogin, projectController.addUserToProjectController); 
router.get('/get-project/:projectId', userAuthMiddleware.isLogin, projectController.getProjectByIdController); 
router.delete('/delete-project/:projectId', userAuthMiddleware.isLogin, projectController.deleteProjectController); 

export default router;