import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { renameSync, unlink, unlinkSync } from "fs";
import jwt from "jsonwebtoken";
import uploadImage from "../utils/uploadImage.js";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createJWT = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

// Sign Up
export const signUp = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const userExist = await User.findOne({ email });

    if (userExist)
      return res.status(404).json({ message: "User already exists" });

    const user = await User.create({ email, password });

    const token = createJWT(email, user._id);

    res.cookie("token", token, {
      sameSite: "None",
      secure: true,
      maxAge,
    });

    return res.status(200).json({
      _id: user.id,
      email: user.email,
      profileSetUp: user.profileSetUp,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = createJWT(email, user._id);

    res.cookie("token", token, {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      _id: user.id,
      email: user.email,
      profileSetUp: user.profileSetUp,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// User info
export const getUserInfo = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user.id,
      email: user.email,
      profileSetUp: user.profileSetUp,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res, next) => {
  const { firstName, lastName, color } = req.body;
  const userId = req.userId;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "FirstName, LastName, Color are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetUp: true,
      },
      { new: true }
    );

    return res.status(200).json({
      _id: user._id,
      email: user.email,
      profileSetUp: user.profileSetUp,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ message: error.message });
  }
};

// Upload Profile Image
export const uploadProfileImage = async (req, res, next) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).send("File is Required");
    }
    const result = await uploadImage(image);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: result.url },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ error: "Internal Server error" });
  }
};

export const removeProfileImage = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("image removed successfully");
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Log out
export const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      expiresIn: Date.now(),
      secure: true,
      sameSite: "none",
    });
    return res.status(200).send("Logout successfully");
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).send("Interner server error ");
  }
};
