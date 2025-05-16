
import express from "express";
import messageModel from "../models/message.model.js";

const router = express.Router();

router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const messages = await messageModel.find({ projectId }).sort({ createdAt: 1 });

    // Decrypt messages before sending
    const decryptedMessages = messages.map((msg) => ({
      ...msg.toObject(),
      message: msg.decryptMessage(),
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;