import { Request, Response } from "express";
import { ChatService } from "./service";
export class ChatController {
  private chatService = new ChatService();

  constructor() {
    this.chatService = new ChatService();
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const chat = await this.chatService.sendMessage(req.body);
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

  async getAll(req: Request, res: Response) {
    try {
      const chatData = await this.chatService.getAll();
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

  async getMessageByUser(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      const chatData = await this.chatService.getMessageByUser(userId);
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
}
