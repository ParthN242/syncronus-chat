import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
  createChannel,
  getChannels,
  uploadChannelFile,
} from "../controllers/channel.controller.js";
import multer from "multer";

const route = express.Router();

const upload = multer({ dest: "uploads/files" });

route
  .post("/create-channel", verifyUser, createChannel)
  .get("/get-channel-list", verifyUser, getChannels)
  .post("/upload-file", verifyUser, upload.single("file"), uploadChannelFile);

export default route;
