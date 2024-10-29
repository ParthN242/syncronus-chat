import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../../../components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { HOST, SEARCH_CONTACT_ROUTE } from "../../../utils/constant";
import { getColor } from "../../../lib/utils";
import { useAppStore } from "../../../store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchContacts, setSearchContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchContact = async (searchTerm) => {
    if (searchTerm.length <= 0) return;

    try {
      const { data } = await axios.get(
        `${SEARCH_CONTACT_ROUTE}?searchTerm=${searchTerm}`
      );
      setSearchContacts(data.searchContacts);
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while searching contact");
    }
  };

  useEffect(() => {
    const debouseHandler = setTimeout(() => {
      if (searchTerm) {
        searchContact(searchTerm);
      }
    }, 1000);
    return () => {
      clearTimeout(debouseHandler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (openNewContactModel === false) {
      setSearchTerm("");
      setSearchContacts([]);
    }
  }, [openNewContactModel]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-sm font-light transition-all duration-300 cursor-pointer text-neutral-400 text-opacity-90 hover:text-neutral-100"
              onClick={() => setOpenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="merriweather-sans-regular">
              Please Select a contact.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              className="w-full p-6 rounded-lg border-none bg-[#2c2e3b] "
              placeholder="Search Contact"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm.length > 0 ? (
            <div className="flex flex-col gap-3 ">
              {searchContacts.map((contact) => (
                <div
                  className="flex gap-5 items-center px-2 cursor-pointer"
                  key={contact._id}
                  onClick={() => {
                    setSelectedChatType("contact");
                    setSelectedChatData(contact);
                    setOpenNewContactModel(false);
                  }}
                >
                  <Avatar className="w-12 h-12">
                    {contact.image ? (
                      <AvatarImage
                        className=" w-full h-full object-cover bg-black"
                        src={`${HOST}/${contact.image}`}
                        alt="profile"
                      />
                    ) : (
                      <div
                        className={`w-full h-full ${getColor(
                          contact.color
                        )} rounded-full border flex items-center justify-center text-2xl font-medium uppercase`}
                      >
                        {contact.firstName
                          ? contact.firstName[0]
                          : contact.email[0]}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="">
                      {contact.firstName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </p>
                    <p className="text-sm">{contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center flex-col h-full">
                <Lottie
                  isClickToPauseDisabled={true}
                  width={100}
                  height={100}
                  options={animationDefaultOptions}
                />
                <div className="text-xl lg:text-2xl mt-5  ">
                  <h3 className="poppins-medium text-opacity-80">
                    Hi<span className="text-purple-500">!</span> Search new{" "}
                    <span className="text-purple-500">Contact.</span>
                  </h3>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
