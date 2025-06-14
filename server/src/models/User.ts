import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  gstNumber: String,
  udyamNumber: String,
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  //this.password = await bcrypt.hash(this.password, 10); --convert password into hash
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  //return bcrypt.compare(candidatePassword, this.password);
  return candidatePassword === this.password;
};

export const User = mongoose.model<IUser>('User', userSchema);