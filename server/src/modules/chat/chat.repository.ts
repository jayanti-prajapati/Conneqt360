import { Types } from "mongoose";
import { BaseRepository } from "../../shared/base.repository";
import { IChat } from "../../types";
import { Chat } from "./model";

export class ChatRepository extends BaseRepository<IChat> {
  constructor() {
    super(Chat);
  }

  async findByUser(userId: string) {
    return Chat.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate(
        "senderId",
        "username email phone businessName businessType profileUrl"
      )
      .populate(
        "receiverId",
        "username email phone businessName businessType profileUrl"
      )
      .sort({ timestamp: -1 });
  }

  async getConversation(userA: string, userB: string) {
    return this.model
      .find({
        $or: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
        isDeleted: false,
      })
       .populate("senderId",   "username email phone businessName businessType profileUrl")
    .populate("receiverId", "username email phone businessName businessType profileUrl")
    .sort({ timestamp: 1 });
  }

  async markMessagesAsRead(senderId: string, receiverId: string) {
    return this.model.updateMany(
      {
        senderId,
        receiverId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );
  }

  async getLatestChatsForUser(userId: string) {
  const userObjId = new Types.ObjectId(userId);

  return this.model.aggregate([
    {
      $match: {
        $or: [
          { senderId: userObjId },
          { receiverId: userObjId }
        ],
        isDeleted: false
      }
    },
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: {
          sender: "$senderId",
          receiver: "$receiverId"
        },
        latestMessage: { $first: "$$ROOT" }
      }
    },
    {
      $replaceRoot: { newRoot: "$latestMessage" }
    },
    {
      $sort: { timestamp: -1 }
    }
  ]);
}
}
