const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// DB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));