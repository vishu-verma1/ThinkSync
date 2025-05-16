import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connect from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js"
import messageRoutes from "./routes/message.route.js";

import cors from "cors";
connect();
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", userRoutes);
app.use("/project", projectRoutes);
app.use("/ai", aiRoutes)
app.use("/api/messages", messageRoutes)
app.get("/", (req, res) => {
  res.send("hello");
});

export default app;
