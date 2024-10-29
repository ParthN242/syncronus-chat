import express from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import {
  getAllContacts,
  getContactsList,
  searchContact,
} from "../controllers/contact.controller.js";

const route = express.Router();

route
  .get("/search", verifyUser, searchContact)
  .get("/get-contact-list", verifyUser, getContactsList)
  .get("/get-all-contact", verifyUser, getAllContacts);

export default route;
