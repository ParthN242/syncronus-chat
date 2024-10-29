import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

export const searchContact = async (req, res, next) => {
  const { searchTerm } = req.query;
  const userId = req.userId;

  if (!searchTerm || searchTerm.length < 0) {
    return res.status(400).json("Invalid search term");
  }

  const regex = { $regex: searchTerm, $options: "i" };
  try {
    const searchContacts = await User.find({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ searchContacts });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json("Internal Server Error");
  }
};

export const getContactsList = async (req, res, next) => {
  let { userId } = req;
  userId = new mongoose.Types.ObjectId(userId);

  try {
    const contactList = await Message.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: [userId, "$sender"] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ contactList });
  } catch (error) {
    console.log("error: ", error);
    return res.status(404).json({ message: "internal server error" });
  }
};

export const getAllContacts = async (req, res) => {
  const userId = req.userId;
  try {
    const users = await User.find({ _id: { $ne: userId } });

    const allContacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));

    return res.status(200).json({ allContacts });
  } catch (error) {
    console.log("error: ", error);
    return res.status(404).send({ message: "Internal server error" });
  }
};
