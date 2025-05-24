import React from "react";
import { useAppStore } from "../../../../store";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { getColor } from "../../../../lib/utils";
import { RiCloseFill } from "react-icons/ri";
import { HOST } from "../../../../utils/constant";

const ChatHeader = () => {
  const {
    selectedChatData,
    selectedChatType,
    setSelectedChatData,
    setSelectedChatType,
  } = useAppStore();

  const clearChatData = () => {
    setSelectedChatData(undefined);
    setSelectedChatType(undefined);
  };
  return (
    <div className="flex items-center justify-between border-b-2 border-[#2f303b] px-20 max-md:px-5 h-[10vh]">
      <div className="flex items-center gap-5">
        <Avatar className="w-12 h-12">
          {selectedChatType === "channel" ? (
            <div
              className={`w-full h-full rounded-full bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb] flex items-center justify-center text-xl font-medium uppercase`}
            >
              #
            </div>
          ) : selectedChatData.image ? (
            <AvatarImage
              className=" w-full h-full object-cover bg-black"
              src={selectedChatData.image}
              alt="profile"
            />
          ) : (
            <div
              className={`w-full h-full ${getColor(
                selectedChatData.color
              )} rounded-full border flex items-center justify-center text-2xl font-medium uppercase`}
            >
              {selectedChatData.firstName
                ? selectedChatData.firstName[0]
                : selectedChatData.email[0]}
            </div>
          )}
        </Avatar>
        <div>
          <h3>
            {selectedChatType === "contact"
              ? selectedChatData.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email
              : selectedChatData.name}
          </h3>
        </div>
      </div>
      <div>
        <RiCloseFill
          className="text-3xl text-opacity-80 text-neutral-500 cursor-pointer"
          onClick={clearChatData}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
