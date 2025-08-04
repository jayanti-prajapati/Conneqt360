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
      .populate('sender', 'name username email profileUrl isOnline')
      .populate('receiver', 'name username email profileUrl isOnline');

      const resp = combineChatsByParticipants(messages)

    res.status(200).json(resp);
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
        { sender: sender, },
        { receiver: sender, }
      ],
    }).sort({ createdAt: 1 })
      .populate('sender', 'name username email profileUrl isOnline')
      .populate('receiver', 'name username email profileUrl isOnline');

      const resp = combineChatsByParticipants(messages)

    res.status(200).json(resp);
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
    res.status(200).json({ message: "Message marked as read " });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read", error: error });
  }
}

function combineChatsByParticipants(messages: any[]) {
  const conversationMap = new Map<string, {
    participants: { sender: any; receiver: any };
    messages: any[];
  }>();
 
  messages.forEach((msg) => {
    // Create a unique key for this conversation, ignoring direction
    const key = [msg.sender._id, msg.receiver._id].sort().join('_');
 
    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        participants: {
          sender: msg.sender,
          receiver: msg.receiver,
        },
        messages: [],
      });
    }
 
    // Push this message to the array
    conversationMap.get(key)!.messages.push(msg);
  });
 
  // Convert Map to array
  const combinedConversations = Array.from(conversationMap.values());
 
  // Sort messages in each conversation by createdAt (optional)
  combinedConversations.forEach((conversation) => {
    conversation.messages.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  });

   const sortedChats = [...(combinedConversations || [])].sort((a: any, b: any) => {
          // Get the latest message time for chat a
          const aMessages = a.messages || [];
          const aLatestMessage = aMessages.length > 0
            ? new Date(aMessages[aMessages.length - 1].createdAt).getTime()
            : new Date(a.updatedAt || 0).getTime();
 
          // Get the latest message time for chat b
          const bMessages = b.messages || [];
          const bLatestMessage = bMessages.length > 0
            ? new Date(bMessages[bMessages.length - 1].createdAt).getTime()
            : new Date(b.updatedAt || 0).getTime();
 
          return bLatestMessage - aLatestMessage; // Sort in descending order
        });
 
  return sortedChats;
}

 
