import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
  getContactMessages,
  sendMessage,
  uploadFile,
} from "../controllers/message.controller.js";
import multer from "multer";

const route = express.Router();

const upload = multer({ dest: "uploads/files" });

route
  .post("/send-message", verifyUser, sendMessage)
  .get("/get-message", verifyUser, getContactMessages)
  .post("/upload-file", verifyUser, upload.single("file"), uploadFile);

export default route;
