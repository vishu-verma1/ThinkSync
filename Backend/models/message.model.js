import mongoose from "mongoose";
import crypto from "crypto";
import "dotenv/config";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; // 32 bytes key
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const messageSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    sender: {
      _id: {
        
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    message: {
      type: String,
      required: true,
    },
    isAiResponse: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt the message before saving
messageSchema.pre("save", function (next) {
  if (this.isModified("message")) {
    this.message = encrypt(this.message);
  }
  next();
});

// Decrypt the message when retrieving
messageSchema.methods.decryptMessage = function () {
  return decrypt(this.message);
};

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;