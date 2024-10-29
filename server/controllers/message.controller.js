import Message from "../models/message.model.js";
import { mkdirSync, renameSync } from "fs";

export const sendMessage = async (req, res) => {
  const { content, recipient } = req.body;
  const userId = req.userId;

  if (!content || !recipient) {
    return res
      .status(400)
      .json({ error: "Please provide content and recipient" });
  }

  try {
    const createMessage = await Message.create({
      sender: userId,
      recipient,
      content,
      messageType: "text",
    });

    const message = await Message.findById(createMessage._id)
      .populate("sender", "_id firstName lastName email image color")
      .populate("recipient", "_id firstName lastName email image color");

    return res.status(201).json(message);
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const getContactMessages = async (req, res) => {
  const { recipient } = req.query;

  if (!recipient)
    return res.status(404).json({ message: "Please enter a recipient" });

  try {
    const messages = await Message.find({
      $and: [
        { sender: { $in: [req.userId, recipient] } },
        { recipient: { $in: [req.userId, recipient] } },
      ],
    })
      .populate("sender", "_id firstName lastName image color ")
      .populate("recipient", "_id firstName lastName image color ");

    return res.status(200).json({ messages });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ messages: "Internal Server Error" });
  }
};

export const uploadFile = async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).send("File is required");

  try {
    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(file.path, fileName);

    const createMessage = await Message.create({
      content: "",
      messageType: "file",
      sender: req.userId,
      fileUrl: fileName,
      recipient: req.body.recipient,
    });

    const message = await Message.findById(createMessage._id)
      .populate("sender")
      .populate("recipient");

    return res.status(201).json({ filePath: fileName, message });
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).json({ message: "Internal server error" });
  }
};
