import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messageType: { type: String, enum: ["text", "file"], required: true },
  content: {
    type: String,
    default: "",
  },
  fileUrl: {
    type: String,
    default: "",
    required: function () {
      return this.messageType === "file";
    },
  },
  timestamp: { type: Date, default: Date.now },
});

const Message = new mongoose.model("Message", messageSchema);

export default Message;
