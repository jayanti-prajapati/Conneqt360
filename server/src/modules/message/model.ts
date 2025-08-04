import mongoose, { Schema, Document } from 'mongoose';
import { Message } from '../../types';


export interface MessageDocument extends Omit<Message, '_id'>, Document {}

const messageSchema = new Schema<MessageDocument>({
  content: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  readBy: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});


export const MessageModel = mongoose.model('Message', messageSchema);