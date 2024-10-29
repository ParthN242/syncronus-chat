import React, { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Input } from "../../components/ui/input";
import { useAppStore } from "../../store";
import { colors } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../../components/ui/avatar";

import {
  DELETE_PROFILE_IMAGE_ROUTE,
  HOST,
  UPDATE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "../../utils/constant";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [image, setImage] = useState(null);
  const [hoverd, setHoverd] = useState(false);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const updateProfileHandler = async () => {
    if (!validateProfile()) return;
    try {
      const { data } = await axios.put(UPDATE_PROFILE_ROUTE, {
        firstName,
        lastName,
        color: selectedColor,
      });
      setUserInfo(data.user);
      toast.success("Profile updated successfully");
      navigate("/");
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while updating profile");
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image Deleted Successfully");
        setImage(null);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handlerFielInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await axios.put(UPDATE_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image Uploaded Successfully");
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-[#1b1c24]">
      <div className="w-[80vw] md:w-max flex flex-col gap-10">
        <div>
          <button
            onClick={() => {
              if (userInfo.profileSetUp) {
                navigate("/");
              }
            }}
          >
            <IoArrowBack className="text-white text-6xl" />
          </button>
        </div>
        <div className="flex gap-5">
          <div
            className="relative"
            onMouseEnter={() => setHoverd(true)}
            onMouseLeave={() => setHoverd(false)}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png , .jpg , .jpeg , .svg , .webp"
            />
            {image ? (
              <Avatar className="w-48 h-48">
                <AvatarImage
                  className=" w-48 h-48 object-cove bg-black"
                  src={image}
                  alt="profile"
                />
              </Avatar>
            ) : (
              <div
                className={`w-48 h-48 ${colors[selectedColor]} rounded-full border flex items-center justify-center text-4xl font-medium uppercase`}
              >
                {userInfo.firstName ? userInfo.firstName[0] : userInfo.email[0]}
              </div>
            )}
            {hoverd && (
              <div
                className="absolute w-48 h-48 top-0 left-0 flex items-center justify-center rounded-full bg-black/50 text-white font-medium text-3xl cursor-pointer"
                onClick={image ? handleDeleteImage : handlerFielInputClick}
              >
                {userInfo.image ? (
                  <div>
                    <FaTrash />
                  </div>
                ) : (
                  <div>
                    <FaPlus />
                  </div>
                )}
              </div>
            )}
          </div>

          <div></div>
          <div className="flex items-center gap-5 flex-col min-w-32 md:min-w-64">
            <Input
              type="email"
              placeholder="email"
              disabled
              value={userInfo.email}
              className="p-6 rounded-lg border-none text-white bg-[#2c2e3b]"
            />
            <Input
              type="text"
              placeholder="first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="p-6 rounded-lg border-none text-white bg-[#2c2e3b]"
            />
            <Input
              type="text"
              placeholder="last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="p-6 rounded-lg border-none text-white bg-[#2c2e3b]"
            />
            <div className="flex gap-4">
              {colors.map((color, index) => (
                <div
                  className={`w-10 h-10 rounded-full ${color} ${
                    selectedColor === index && "border-white/40 border-2"
                  }`}
                  onClick={() => setSelectedColor(index)}
                  key={index}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Button
            className="w-full bg-purple-700 hover:bg-purple-900 rounded-lg text-white p-6 h-16"
            onClick={updateProfileHandler}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
