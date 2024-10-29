import React from "react";
import ChatHeader from "./ChatHeader";
import MessageContainer from "./MessageContainer";
import MessageBar from "./MessageBar";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-full w-full flex flex-col md:static flex-1 bg-[#1c1d25] text-white">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
