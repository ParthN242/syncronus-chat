import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GET_MESSAGE_ROUTE, HOST } from "../../../../utils/constant";
import { useAppStore } from "../../../../store";
import moment from "moment";
import { useSocket } from "../../../../context/SocketProvider";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { getColor } from "../../../../lib/utils";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {
  const {
    selectedChatData,
    userInfo,
    selectedChatType,
    setChannelList,
    channelList,
  } = useAppStore();

  const socket = useSocket();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  let lastDate = null;

  const checkImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const getCleanFileName = (url) => {
    // get last part of URL (filename)
    const encodedName = url.split("/").pop().split("?")[0];

    // decode URI components (%20 to spaces, etc)
    const decodedName = decodeURIComponent(encodedName);

    // split by underscore to separate base name and uuid part
    const parts = decodedName.split("_");

    const namePart = parts[0]; // first part (e.g. "Javascript Quick Study Guide (2)")

    // combine rest of parts to get extension part (like "1298d145-bde7-42ad-9fc1-462eea7b2833.pdf")
    const extensionPart = parts.length > 1 ? parts.slice(1).join("_") : "";

    // get extension if available
    const extension = extensionPart.includes(".")
      ? extensionPart.substring(extensionPart.lastIndexOf(".") + 1)
      : "";

    // build final filename with extension
    return extension ? `${namePart}.${extension}` : namePart;
  };

  const downloadFile = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response not ok");

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const fileName = getCleanFileName(url);

      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `${GET_MESSAGE_ROUTE}?recipient=${selectedChatData._id}`
        );
        setMessages(data.messages);
      } catch (error) {
        console.log("error: ", error);
        toast.error("Error while getting messages");
      }
    };

    if (userInfo && selectedChatData && selectedChatType === "contact")
      getMessages();

    if (userInfo && selectedChatData && selectedChatType === "channel")
      setMessages(selectedChatData.messages);
  }, [userInfo, selectedChatData]);

  useEffect(() => {
    if (!socket) return;

    const handleContactMessage = (message) => {
      if (
        selectedChatType !== undefined &&
        (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
      ) {
        setMessages((pre) => [...pre, message]);
      }
    };

    const handleChannelMessage = (message) => {
      if (
        selectedChatType !== undefined &&
        selectedChatData._id === message.channel._id
      ) {
        setMessages((pre) => [...pre, message.message]);
      } else {
        const addMessage = [...channelList];
        addMessage
          .find((c) => c._id === message.channel._id)
          .messages.push(message.message);
        setChannelList(addMessage);
      }
    };

    socket.on("receive-message", handleContactMessage);

    socket.on("receive-channel-message", handleChannelMessage);

    return () => {
      socket.off("receive-message", handleContactMessage);
      socket.off("receive-channel-message", handleChannelMessage);
    };
  }, [socket, selectedChatType, selectedChatData]);

  useEffect(() => {
    if (bottomRef.current !== null) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bottomRef, messages]);

  return (
    <div className="flex-1 text-white p-6 overflow-auto scrollbar-hidden">
      {messages.map((message) => {
        const messageDate = moment(message.timestamp).format("DD-MM-YYYY");
        const showDate = messageDate !== lastDate;
        lastDate = messageDate;

        lastDate = messageDate;
        return (
          <div key={message._id}>
            {showDate && (
              <div className="text-sm text-center text-gray-400 my-2">
                {moment(message.timestamp).format("LL")}
              </div>
            )}
            <div
              className={`mt-5  ${
                userInfo._id === message.sender._id ? "text-right" : "text-left"
              }`}
            >
              {message.messageType === "text" ? (
                <>
                  <div
                    className={`p-4 w-fit inline-block max-w-[50%] border rounded-lg ${
                      userInfo._id === message.sender._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"
                    }`}
                  >
                    {message.content}
                  </div>
                </>
              ) : checkImage(message.fileUrl) ? (
                <div
                  className={` p-4 w-fit inline-block border rounded my-1 max-w-[50%] break-words ${
                    userInfo._id === message.sender._id
                      ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                      : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"
                  }`}
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}
                >
                  <img
                    src={message.fileUrl}
                    className="object-cover h-full"
                    alt={message.fileUrl}
                    width={300}
                    height={300}
                  />
                </div>
              ) : (
                <div
                  className={` p-4 w-fit inline-block border rounded my-1 max-w-[80%] break-words ${
                    userInfo._id === message.sender._id
                      ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                      : "bg-[#2a2b33]/5 text-white/80 border-[#fff]/20"
                  }`}
                >
                  <div className="flex items-center justify-center gap-5 max-md:gap-2">
                    <span className="p-3 text-3xl max-md:text-sm rounded-full bg-black/20 text-white/80 ">
                      <MdFolderZip className="max-md:text-lg" />
                    </span>
                    <span className="max-md:line-clamp-1">
                      {decodeURIComponent(
                        message.fileUrl?.split("/").pop().split("_")[0]
                      )}
                    </span>
                    <span
                      className="p-3 text-2xl max-md:text-lg transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
                      onClick={() => downloadFile(message.fileUrl)}
                    >
                      <IoMdArrowRoundDown className="" />
                    </span>
                  </div>
                </div>
              )}

              {selectedChatType === "channel" &&
              userInfo._id !== message.sender._id ? (
                <div className="flex gap-2 mt-2 items-center  ">
                  <Avatar className="w-6 h-6">
                    {message.sender.image ? (
                      <AvatarImage
                        className=" w-full h-full object-cover bg-black"
                        src={`${HOST}/${message.sender.image}`}
                        alt="profile"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${getColor(
                          message.sender.color
                        )} rounded-full border flex items-center justify-center text-xs uppercase`}
                      >
                        {message.sender.firstName
                          ? message.sender.firstName[0]
                          : message.sender.email[0]}
                      </div>
                    )}
                  </Avatar>
                  <p className=" text-white/60 text-xs">
                    {message.sender.firstName}
                  </p>
                  <div className="text-xs text-gray-600">
                    {moment(message.timestamp).format("LT")}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-600 mt-1">
                  {moment(message.timestamp).format("LT")}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={imageUrl} className="h-[80vh] w-full bg-cover" />
          </div>
          <div className="fixed top-0 flex gap-5 mt-5">
            <button
              className="p-3 text-2xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="p-3 text-2xl transition-all duration-300 rounded-full cursor-pointer bg-black/20 hover:bg-black/50"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
