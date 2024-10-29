import express from "express";
import {
  getUserInfo,
  login,
  logout,
  removeProfileImage,
  signUp,
  updateProfile,
  uploadProfileImage,
} from "../controllers/auth.controll.js";
import { verifyUser } from "../middleware/authMiddleware.js";
import multer from "multer";

const route = express.Router();

const upload = multer({ dest: "uploads/profiles/" });

route
  .post("/signup", signUp)
  .post("/login", login)
  .get("/user-info", verifyUser, getUserInfo)
  .put("/update-profile", verifyUser, updateProfile)
  .put(
    "/update-profile-image",
    verifyUser,
    upload.single("profile-image"),
    uploadProfileImage
  )
  .delete("/delete-profile-image", verifyUser, removeProfileImage)
  .get("/logout", verifyUser, logout);

export default route;
