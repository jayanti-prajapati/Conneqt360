import mongoose, { Schema, Types } from "mongoose";
import { IChat } from "../../types";

const chatSchema = new Schema<IChat>({
  senderId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  receiverId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  attachments: [
    {
      type: String,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Chat = mongoose.model<IChat>("chat", chatSchema);
