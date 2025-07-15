import { Request, Response } from 'express';
import { MessageModel } from './model';


export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, sender, receiver, type = 'text' } = req.body;

    if (!content || !sender || !receiver) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await MessageModel.create({
      content,
      sender,
      receiver,
      type,
      edited: false,
      readBy: [],
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const { sender, receiver } = req.query;
    if (!sender || !receiver) {
      return res.status(400).json({ message: 'Missing participants' });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 })
     .populate('sender', 'name username email profileUrl') 
      .populate('receiver', 'name username email profileUrl');

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err });
  }
};

export const getConversationBySender = async (req: Request, res: Response) => {
  try {
    const { sender } = req.query;
    if (!sender) {
      return res.status(400).json({ message: 'Missing sender' });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: sender, }
      ],
    }).sort({ createdAt: 1 })
     .populate('sender', 'name username email profileUrl') 
      .populate('receiver', 'name username email profileUrl');

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    if (!messageId || !userId) {
      return res.status(400).json({ message: 'messageId and userId are required' });
    }

    const messageData = await MessageModel.findById(messageId);

    if (!messageData) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Avoid duplicate read entry
    const alreadyRead = messageData.readBy.some(read => read.user.toString() === userId);

    if (!alreadyRead) {
      messageData.readBy.push({ user: userId, readAt: new Date() });
      await messageData.save();
    }
    res.status(200).json({ message: "Message marked as read "});
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read", error: error });
  }
}
