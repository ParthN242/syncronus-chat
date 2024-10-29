import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import MultipleSelector from "../../../../components/ui/MultiSelector";
import { toast } from "sonner";
import axios from "axios";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACT_ROUTE,
} from "../../../../utils/constant";
import { useAppStore } from "../../../../store";

const NewChannel = () => {
  const { userInfo, setSelectedChatType, setSelectedChatData } = useAppStore();

  const [channelName, setChannelName] = useState("");
  const [openNewChannelModel, setOpenNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);

  const createChannelHandler = async () => {
    try {
      const { data } = await axios.post(CREATE_CHANNEL_ROUTE, {
        name: channelName,
        members: selectedContact.map((member) => member.value),
      });
      setOpenNewChannelModel(false);
      setSelectedChatData(data.channel);
      setSelectedChatType("channel");
      toast.success("Channel created successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while creating channel");
    }
  };

  useEffect(() => {
    if (!userInfo) return;
    const fetchAllContacts = async () => {
      try {
        const { data } = await axios.get(GET_ALL_CONTACT_ROUTE);
        setAllContacts(data.allContacts);
      } catch (error) {
        console.log("error: ", error);
        toast.error("Error while geting all contacts");
      }
    };
    fetchAllContacts();
  }, [userInfo]);

  useEffect(() => {
    if (openNewChannelModel === false) {
      setChannelName("");
      setSelectedContact([]);
    }
  }, [openNewChannelModel]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-sm font-light transition-all duration-300 cursor-pointer text-neutral-400 text-opacity-90 hover:text-neutral-100"
              onClick={() => setOpenNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Craete New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewChannelModel} onOpenChange={setOpenNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create a new channel</DialogTitle>
            <DialogDescription className="merriweather-sans-regular"></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              type="text"
              placeholder="Enter channel name"
              className="w-full rounded-lg bg-[#2c2e3b] p-6 border-none "
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <MultipleSelector
              className="w-full rounded-lg bg-[#2c2e3b] py-2 px-3 border-none text-white mt-3 "
              placeholder="Search Contact "
              defaultOptions={allContacts}
              value={selectedContact}
              onChange={setSelectedContact}
              emptyIndicator={
                <p className="text-center text-gray-600 leading-10 text-lg">
                  No Result found
                </p>
              }
            />
            <button
              className="mt-3 bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] rounded-lg border-none text-center w-full p-3 font-medium"
              onClick={createChannelHandler}
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewChannel;
