import React, { useEffect, useState } from "react";
import { useAppStore } from "../../../../store";
import axios from "axios";
import {
  GET_CHANNEL_LIST_ROUTE,
  GET_CONTACT_LIST_ROUTE,
  HOST,
} from "../../../../utils/constant";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { getColor } from "../../../../lib/utils";
import { useSocket } from "../../../../context/SocketProvider";

const ContactList = ({ isChannel, contactList = [] }) => {
  const {
    userInfo,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatData,
    selectedChatType,
  } = useAppStore();
  const socket = useSocket();

  // const [contactList, setContactList] = useState([]);

  // useEffect(() => {
  //   if (!userInfo) return;

  //   const fetchContactList = async () => {
  //     try {
  //       const { data } = await axios.get(GET_CONTACT_LIST_ROUTE);
  //       setContactList(data.contactList);
  //     } catch (error) {
  //       console.log("error: ", error);
  //       toast.error("error while fetching contact list");
  //     }
  //   };
  //   const fetchChannelList = async () => {
  //     try {
  //       const { data } = await axios.get(GET_CHANNEL_LIST_ROUTE);
  //       setContactList(data.channels);
  //     } catch (error) {
  //       console.log("error: ", error);
  //       toast.error("error while fetching channel contact list");
  //     }
  //   };
  //   if (!isChannel) fetchContactList();
  //   if (isChannel) fetchChannelList();
  // }, [userInfo]);

  return (
    <div className="flex flex-col gap-[2px] mt-2">
      {contactList.length > 0 &&
        contactList.map((contact) => (
          <div
            key={contact._id}
            className={`flex items-center text-white gap-4 cursor-pointer pl-10 pr-10 py-2 transition-all duration-300 hover:bg-[#f1f1f111] ${
              selectedChatData?._id === contact._id ? "bg-[#8417ff]" : ""
            }`}
            onClick={() => {
              setSelectedChatData(contact);
              setSelectedChatType(isChannel ? "channel" : "contact");
            }}
          >
            <Avatar className="">
              {isChannel ? (
                <div
                  className={`w-full h-full rounded-full bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb] flex items-center justify-center text-xl font-medium uppercase`}
                >
                  #
                </div>
              ) : contact.image ? (
                <AvatarImage
                  className=" w-full h-full object-cover bg-black"
                  src={contact.image}
                  alt="profile"
                />
              ) : (
                <div
                  className={`w-full h-full ${getColor(
                    contact.color
                  )} rounded-full border flex items-center justify-center text-xl font-medium uppercase`}
                >
                  {contact.firstName ? contact.firstName[0] : contact.email[0]}
                </div>
              )}
            </Avatar>
            <div>
              {isChannel ? (
                <p>{contact.name}</p>
              ) : (
                <p>
                  {contact.firstName
                    ? `${contact.firstName} ${contact.lastName}`
                    : contact.email}
                </p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ContactList;
