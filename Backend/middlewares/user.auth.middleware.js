import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";
export const isLogin = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // console.log(token, "token")

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const isBlacklisted = await redisClient.get(token);

  if (isBlacklisted) {
    res.cookie(token, "");
    return res
      .status(401)
      .json({ message: "Unauthorized: Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.error("Error in isLogin middleware:", error);
    return res.status(401).json({ message: "Unauthorized", error });
  }
};
