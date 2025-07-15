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
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ message: 'Missing participants' });
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 })
     .populate('sender', 'name username email profileUrl') 
      .populate('receiver', 'name username email profileUrl');

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err });
  }
};
