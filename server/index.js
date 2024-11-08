import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import contactRoute from "./routes/contact.route.js";
import messageRoute from "./routes/message.route.js";
import channelRoute from "./routes/channel.route.js";
import { setupSocket } from "./socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

app.use(
  cors({
     origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/contact", contactRoute);
app.use("/api/message", messageRoute);
app.use("/api/channel", channelRoute);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

setupSocket(server, app);

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to database");
    console.log("error", err);
  });
