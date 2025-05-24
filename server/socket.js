import { Server } from "socket.io";
import Message from "./models/message.model.js";
import Channel from "./models/channel.model.js";

export const setupSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.ORIGIN],
      method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();

  const disconnectSocket = (socket) => {
    console.log(`User Disconnected : ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = (message) => {
    const senderId = userSocketMap.get(message.sender._id);
    const recipientId = userSocketMap.get(message.recipient._id);

    if (recipientId) {
      // console.log("recipientId: ", recipientId);
      io.to(recipientId).emit("receive-message", message);
    }
    if (senderId) {
      // console.log("senderId: ", senderId);
      io.to(senderId).emit("receive-message", message);
    }
  };

  const sendChannelMessage = async (channel) => {
    const createMessage = await Message.create(channel.message);

    const findMessage = await Message.findById(createMessage._id).populate(
      "sender",
      "_id email firstName lastName image color"
    );

    const findChannel = await Channel.findById(channel.message.channelId);

    findChannel.messages.push(findMessage);
    findChannel.updatedAt = findMessage.timestamp;

    await findChannel.save();

    // console.log("channel.members: ", channel.members);
    channel.members.forEach((member) => {
      io.to(userSocketMap.get(member)).emit("receive-channel-message", {
        message: findMessage,
        channel: findChannel,
      });
    });
  };

  app.set("io", io);

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.log("userid not provided during connection");
    }

    userSocketMap.set(userId, socket.id);
    console.log(`User connected: ${userId} => ${socket.id}`);

    socket.on("send-message", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnectSocket(socket));
  });
};
