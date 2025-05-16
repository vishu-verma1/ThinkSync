import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validateUser, loginValidator } from "../validators/userValidator.js";
import * as userAuthMiddleware from "../middlewares/user.auth.middleware.js";

const router = Router();

router.post("/register", validateUser, userController.createUserController);
router.post("/login", loginValidator , userController.loginUserController);
router.get("/profile", userAuthMiddleware.isLogin,  userController.getProfileUserController);
router.get("/logout", userAuthMiddleware.isLogin,  userController.logoutUserController);
router.get("/all", userAuthMiddleware.isLogin,  userController.getAllUserController);

export default router;
