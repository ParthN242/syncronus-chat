import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";
import {
  SEND_CHANNEL_FILE_ROUTE,
  SEND_FILE_ROUTE,
  SEND_MESSAGE_ROUTE,
} from "../../../../utils/constant";
import { useAppStore } from "../../../../store";
import { useSocket } from "../../../../context/SocketProvider";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
  const emojiRef = useRef();
  const inputFileRef = useRef();
  const { selectedChatData, selectedChatType, userInfo } = useAppStore();
  const [EmojiModelOpen, setEmojiModelOpen] = useState(false);
  const socket = useSocket();
  const inputRef = useRef();

  const [message, setMessage] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    if (selectedChatType === "contact") {
      try {
        const { data } = await axios.post(SEND_MESSAGE_ROUTE, {
          content: message,
          recipient: selectedChatData._id,
        });
        socket.emit("send-message", data);
        setMessage("");
      } catch (error) {
        console.log("error: ", error);
        toast.error("error while sending message");
      }
    }
    if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        message: {
          content: message,
          sender: userInfo._id,
          channelId: selectedChatData._id,
          messageType: "text",
        },
        members: [...selectedChatData.members, selectedChatData.admin],
      });
      setMessage("");
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji.emoji);
  };

  const handleAttachmentSend = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      if (selectedChatType === "contact") {
        formData.append("recipient", selectedChatData._id);
        const { data } = await axios.post(SEND_FILE_ROUTE, formData);

        socket.emit("send-message", data.message);
      }
      if (selectedChatType === "channel") {
        const { data } = await axios.post(SEND_CHANNEL_FILE_ROUTE, formData);
        socket.emit("send-channel-message", {
          message: {
            content: "",
            fileUrl: data.filePath,
            sender: userInfo._id,
            channelId: selectedChatData._id,
            messageType: "file",
          },
          members: [...selectedChatData.members, selectedChatData.admin],
        });
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while uploading file");
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setMessage("");
    }
  }, [inputRef.current, selectedChatData]);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiModelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [emojiRef.current]);

  return (
    <div className="h-[10vh] flex items-center justify-center mb-6 px-8 box-border">
      <form
        onSubmit={handleSendMessage}
        className="w-full flex items-center gap-5 text-white"
      >
        <div className="bg-[#2a2b33] p-5 rounded-lg flex flex-1 items-center justify-between pr-5">
          <input
            type="text"
            placeholder="Enter Message"
            className="flex-1 border-none border-0 bg-transparent outline-none focus:border-none focus:outline-none focus:ring-0"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            ref={inputRef}
          />
          <div className="relative text-2xl text-opacity-80 text-neutral-500 flex items-center gap-5">
            <ImAttachment
              className="cursor-pointer"
              onClick={() => inputFileRef.current.click()}
            />
            <input
              type="file"
              className="hidden"
              ref={inputFileRef}
              onChange={handleAttachmentSend}
            />
            <RiEmojiStickerLine
              className="cursor-pointer"
              onClick={() => setEmojiModelOpen(true)}
            />
            <div className="absolute right-0 bottom-16" ref={emojiRef}>
              <EmojiPicker
                open={EmojiModelOpen}
                className=""
                theme="dark"
                onEmojiClick={handleAddEmoji}
              />
            </div>
          </div>
        </div>
        <div>
          <button className="transition-all duration-300 focus:border-none focus:outline-none focus:text-white bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda]">
            <IoSend className="text-2xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageBar;
