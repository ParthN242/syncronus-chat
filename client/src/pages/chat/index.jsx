import React, { useEffect } from "react";
import { useAppStore } from "../../store";
import { useNavigate } from "react-router-dom";
import ContactContainer from "./contactContainer";
import EmptyChatContainer from "./EmptyChatContainer";
import ChatContainer from "./ChatContainer";

const ChatPage = () => {
  const navigate = useNavigate();
  const { userInfo, selectedChatType } = useAppStore();

  useEffect(() => {
    if (!userInfo.profileSetUp) {
      navigate("/profile");
    }
  }, [userInfo]);

  return (
    <div className="flex h-[100vh] relative">
      <ContactContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default ChatPage;
