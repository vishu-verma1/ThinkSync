import "dotenv/config";

import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import result from "./services/ai.service.js";
import messageModel from "./models/message.model.js";

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// middleware for authentication
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization &&
        socket.handshake.headers.authorization.split(" ")[1]);

    const projectId = socket.handshake.query.projectid;

    // console.log("Handshake query projectid:", projectId);
    // console.log("Received token:", token);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log("Invalid project ID");
      return next(new Error("Authentication Error"));
    }

    socket.project = await projectModel.findById(projectId);

    if (!token) {
      console.log("No token provided");
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      console.log("Invalid token");
      return next(new Error("Authentication error: Invalid token"));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    console.log("Error in socket connection:", error.message);
    next(new Error("Authentication error: " + error.message));
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();
  console.log("User connected:", socket.user);

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    console.log(data,"+++")
    const message = data.message;

    if (!message || typeof message !== "string") {
      console.error("Invalid message:", message);
      return;
    }

    try {
      const savedMessage = await messageModel.create({
        projectId: socket.roomId,
        sender: {
          _id: socket.user.id.toString(),
          email: data.sender.email,
        },
        message: message,
        isAiResponse: false,
      });

      // Decrypt the message before sending it to the frontend
      const decryptedMessage = savedMessage.decryptMessage();

      socket.broadcast.to(socket.roomId).emit("project-message", {
        message: decryptedMessage,
        sender: savedMessage.sender,
      });
    } catch (error) {
      console.error("Error saving user message:", error);
    }







    const aiIsPresentInMessage = message.includes("@ai");
    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if (aiIsPresentInMessage) {
      const prompt = message.replace("@ai", "");
      try {
        const aiResponse = await result(prompt);

        const savedAiMessage = await messageModel.create({
          projectId: socket.roomId,
          sender: {
            _id: "ai",
            email: "AI",
          },
          message: aiResponse,
          isAiResponse: true,
        });

        // io.to(socket.roomId).emit("project-message", {
        //   message: JSON.stringify({ text: aiResponse }), // Ensure the response is stringified
        //   sender: {
        //     _id: "ai",
        //     email: "AI",
        //   },
        // });

        const decryptedAiMessage = savedAiMessage.decryptMessage();

        io.to(socket.roomId).emit("project-message", {
          message: decryptedAiMessage,
          sender: savedAiMessage.sender,
        });


      } catch (error) {
        console.error("Error generating AI response:", error);
      }
    }
  });

  socket.on("event", (data) => {});

  socket.on("disconnect", () => {
    console.log("User disconnected");

    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`port is running on ${port}`);
});
