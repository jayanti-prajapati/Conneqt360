import { IChat } from "../../types";
import { ChatRepository } from "./chat.repository";

export class ChatService {
    private chatRepo = new ChatRepository();

    async sendMessage(chatData: Partial<IChat>) {
        return this.chatRepo.create(chatData);
    }

    // async getAll() {
    //     return this.chatRepo.findAll()
    //     .populate("senderId",   "username email phone businessName businessType profileUrl")
    //   .populate("receiverId", "username email phone businessName businessType profileUrl")
    //   .sort({ timestamp: -1 })
    // }

    async getConversation(userA: string, userB: string) {
    const messages = await this.chatRepo.getConversation(userA, userB);
    await this.chatRepo.markMessagesAsRead(userB, userA); 
    return messages;
  }

  async getUserChatList(userId: string) {
  return this.chatRepo.getLatestChatsForUser(userId);
}

    
}