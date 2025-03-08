import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateUser } from "../validators/userValidator.js";
import * as userAuthMiddleware from "../middlewares/user.auth.middleware.js";

const router = Router();

router.post("/register", validateUser, userController.createUserController);
router.post("/login", validateUser, userController.loginUserController);
router.get("/profile", userAuthMiddleware.isLogin,  userController.getProfileUserController);
router.get("/logout", userAuthMiddleware.isLogin,  userController.logoutUserController);

export default router;
