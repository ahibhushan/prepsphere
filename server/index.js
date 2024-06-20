import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserRouter } from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserApp } from "./routes/openai.js";
import { UserFeedback } from "./routes/feedback.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", UserRouter);
app.use("/chatgpt", UserApp);
app.use("/feedback", UserFeedback);

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

mongoose.connect("mongodb://127.0.0.1:27017/authentication");

app.listen(process.env.PORT, () => {
  console.log("Server is Running");
});
