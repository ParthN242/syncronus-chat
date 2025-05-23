import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import { HOST, LOGOUT_ROUTE } from "../../../utils/constant";
import { getColor } from "../../../lib/utils";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { toast } from "sonner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const logout = async () => {
    try {
      await axios.get(LOGOUT_ROUTE);
      toast.success("Log out successfully");
      setUserInfo(undefined);
      navigate("/auth");
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while logging out");
    }
  };

  return (
    <div className=" w-full bottom-0 left-0  text-white bg-[#2a2b33] h-16 px-8 flex items-center justify-between gap-3">
      <Avatar className="w-12 h-12">
        {userInfo.image ? (
          <AvatarImage
            className=" w-full h-full object-cover bg-black"
            src={userInfo.image}
            alt="profile"
          />
        ) : (
          <div
            className={`w-full h-full ${getColor(
              userInfo.color
            )} rounded-full border flex items-center justify-center text-2xl font-medium uppercase`}
          >
            {userInfo.firstName ? userInfo.firstName[0] : userInfo.email[0]}
          </div>
        )}
      </Avatar>
      <div>
        <p>
          {userInfo.firstName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : userInfo.email}
        </p>
      </div>
      <div className="flex items-center gap-5 text-xl">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-xl font-medium text-purple-500"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-xl font-medium text-red-500"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
