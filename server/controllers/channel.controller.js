import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";
import { mkdirSync, renameSync } from "fs";

export const createChannel = async (req, res) => {
  const { name, members } = req.body;

  if (!name || !members || members.length < 2)
    return res
      .status(400)
      .json({ message: "Please provide valide name and members" });

  const channel = await Channel.create({ name, members, admin: req.userId });

  res.status(201).json({ channel });

  try {
  } catch (error) {
    console.log("error: ", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

export const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      $or: [{ members: req.userId }, { admin: req.userId }],
    })
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "_id email firstName lastName image color",
        },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({ channels });
  } catch (error) {
    console.log("error: ", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

export const sendChannelMessage = async (req, res) => {
  const { content, channelId } = req.body;

  try {
    if (!channelId || !content)
      return res
        .status(400)
        .json({ message: "please provide a channelId and content" });

    const createMessage = await Message.craete({ content, sender: req.userId });

    const message = await Message.findById(createMessage._id).populate(
      "sender",
      "_id email firstName lastName image color"
    );

    const channel = await Channel.findById(channelId);

    channel.messages.push(message);

    await channel.save();

    res.status(201).json({ message });
  } catch (error) {
    console.log("error: ", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

export const uploadChannelFile = async (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).send("File is required");

  try {
    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${file.originalname}`;

    mkdirSync(fileDir, { recursive: true });

    renameSync(file.path, fileName);

    return res.status(201).json({ filePath: fileName });
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).json({ message: "Internal server error" });
  }
};
