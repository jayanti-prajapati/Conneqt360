import { IChat } from "../../types";
import { ChatRepository } from "./chat.repository";

export class ChatService {
    private chatRepo = new ChatRepository();

    async sendMessage(chatData: Partial<IChat>) {
        return this.chatRepo.create(chatData);
    }

    async getAll() {
        return this.chatRepo.findAll()
        .populate("senderId",   "username email phone businessName businessType profileUrl")
      .populate("receiverId", "username email phone businessName businessType profileUrl")
      .sort({ timestamp: -1 })
    }

    async getMessageByUser(userId: string) {
        return this.chatRepo.findByUser(userId);
    }

    
}