import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/routes";
import userRoutes from "./modules/user/routes";
import customRoutes from "./modules/custom-files/routes"
import communityRoutes from "./modules/community-feeds/routes";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/community-feeds", communityRoutes);
app.use("/api/custom-file", customRoutes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
