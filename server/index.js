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
import { v2 as cloudinary } from "cloudinary";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;

const NODE_ENV = process.env.NODE_ENV;
const isProduction = NODE_ENV === "PRODUCTION";

const corsOptions = {
  origin: isProduction ? [process.env.ORIGIN] : true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/files", express.static("uploads/files"));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/contact", contactRoute);
app.use("/api/message", messageRoute);
app.use("/api/channel", channelRoute);

app.use("*", (req, res) => {
  res.json("Bad request");
});

const server = http.createServer(app);

setupSocket(server, app, corsOptions);

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Error connecting to database");
    console.log("error", err);
  });

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "internal server error",
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
