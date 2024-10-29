import React, { useEffect } from "react";
import ProfileInfo from "../ProfileInfo";
import NewDM from "../NewDm";
import ContactList from "./ContactList";
import NewChannel from "./NewChannel";
import { useAppStore } from "../../../store";
import {
  GET_CHANNEL_LIST_ROUTE,
  GET_CONTACT_LIST_ROUTE,
} from "../../../utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useSocket } from "../../../context/SocketProvider";

const ContactContainer = () => {
  const { userInfo, contactList, setContactList, channelList, setChannelList } =
    useAppStore();

  const socket = useSocket();

  useEffect(() => {
    if (!userInfo) return;

    const fetchContactList = async () => {
      try {
        const { data } = await axios.get(GET_CONTACT_LIST_ROUTE);
        setContactList(data.contactList);
      } catch (error) {
        console.log("error: ", error);
        toast.error("error while fetching contact list");
      }
    };
    const fetchChannelList = async () => {
      try {
        const { data } = await axios.get(GET_CHANNEL_LIST_ROUTE);
        setChannelList(data.channels);
      } catch (error) {
        console.log("error: ", error);
        toast.error("error while fetching channel contact list");
      }
    };
    fetchContactList();
    fetchChannelList();
  }, [userInfo]);

  useEffect(() => {
    if (!socket) return;

    const handleContactList = (message) => {
      console.log("update contact list");

      const { contactList, setContactList } = useAppStore.getState();
      const updatedContacts = [...contactList];

      let index;
      if (userInfo._id === message.recipient._id) {
        index = updatedContacts.findIndex((c) => c._id === message.sender._id);
      }
      if (userInfo._id === message.sender._id) {
        index = updatedContacts.findIndex(
          (c) => c._id === message.recipient._id
        );
      }

      if (index > -1) {
        const [updatedContact] = updatedContacts.splice(index, 1);
        updatedContacts.unshift(updatedContact);
      } else {
        if (userInfo._id === message.recipient._id) {
          updatedContacts.unshift(message.sender);
        } else if (userInfo._id === message.sender._id) {
          updatedContacts.unshift(message.recipient);
        }
      }

      setContactList(updatedContacts);
    };

    const handlChannelList = (message) => {
      console.log("update channel list");

      const { channelList, setChannelList } = useAppStore.getState();
      const updatedChannels = [...channelList];
      const index = updatedChannels.findIndex(
        (c) => c._id === message.channel._id
      );
      if (index > -1) {
        const [updatedChannel] = updatedChannels.splice(index, 1);
        updatedChannels.unshift(updatedChannel);
      } else {
        updatedChannels.unshift(message.channel);
      }
      setChannelList(updatedChannels);
    };

    socket.on("receive-message", handleContactList);
    socket.on("receive-channel-message", handlChannelList);

    return () => {
      socket.off("receive-message", handleContactList);
      socket.off("receive-channel-message", handlChannelList);
    };
  }, [socket, userInfo]);

  return (
    <div className="w-full flex flex-col justify-between relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] overflow-auto">
      <div className="mt-3">
        <Logo />
      </div>
      <div className="mt-5 flex-1 overflow-auto pb-[10vh]">
        <div className="flex flex-col gap-3 ">
          <div className="flex items-center justify-between pl-10 pr-10">
            <Title title={"Direct Messages"} />
            <NewDM />
          </div>
          <div className="max-h-[35vh] overflow-auto">
            <ContactList contactList={contactList} />
          </div>
        </div>
        <div className="flex flex-col gap-3  mt-5">
          <div className="flex items-center justify-between pl-10 pr-10 ">
            <Title title={"Channels"} />
            <NewChannel />
          </div>
          <div className="max-h-[35vh] overflow-auto">
            <ContactList isChannel contactList={channelList} />
          </div>
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-5">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold text-white">Syncrous</span>
    </div>
  );
};

const Title = ({ title }) => {
  return (
    <h6 className=" text-sm font-light tracking-widest uppercase text-neutral-400 text-opacity-90 ">
      {title}
    </h6>
  );
};

export default ContactContainer;
