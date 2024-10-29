import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated." });
  }

  const verified = jwt.verify(token, process.env.JWT_KEY);

  if (!verified)
    return res.status(401).json({ message: "You are not authenticated." });

  req.userId = verified.userId;
  next();
};
