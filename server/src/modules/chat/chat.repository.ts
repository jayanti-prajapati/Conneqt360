import { BaseRepository } from "../../shared/base.repository";
import { IChat } from "../../types";
import { Chat } from "./model";

export class ChatRepository extends BaseRepository<IChat> {
    constructor() {
        super(Chat);
    }

    async findByUser(userId: string) {
  return Chat.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  })
    .populate("senderId",   "username email phone businessName businessType profileUrl")
    .populate("receiverId", "username email phone businessName businessType profileUrl")
    .sort({ timestamp: -1 });
}
}