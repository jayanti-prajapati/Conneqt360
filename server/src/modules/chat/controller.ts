import { Request, Response } from "express";
import { ChatService } from "./service";
export class ChatController {
  private chatService = new ChatService();

  constructor() {
    this.chatService = new ChatService();
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { senderId, receiverId, message, attachments } = req.body;

      if (!senderId || !receiverId || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const chat = await this.chatService.sendMessage({ senderId, receiverId, message, attachments });
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: chat,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  // async getAll(req: Request, res: Response) {
  //   try {
  //     const chatData = await this.chatService.getAll();
  //     return res.status(200).json({
  //       statusCode: 200,
  //       message: "success",
  //       data: chatData,
  //     });
  //   } catch (error: any) {
  //     return res.status(400).json({
  //       statusCode: 400,
  //       message: "failed",
  //       error: error.message,
  //     });
  //   }
  // }

  async getConversation(req: Request, res: Response) {
    try {
      const { userA, userB } = req.params;

      if (!userA || !userB) {
        return res.status(400).json({ message: "Missing user IDs" });
      }

      const chatData = await this.chatService.getConversation(userA, userB);
      if (!chatData) {
        return res.status(404).json({
          statusCode: 404,
          message: "User id not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: chatData,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

   async getChatList(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const chats = await this.chatService.getUserChatList(userId);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat list" });
  }
}


}
