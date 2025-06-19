import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../../types";

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: false,
    },
    businessName: {
        type: String,
        required: false
    },
    businessType: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    connections: {
        type: Number,
        required: false
    },
    products: {
        type: Number,
        required: false
    },
    rating: {
        type: Number,
        required: false
    },
    gstNumber: {
        type: String,
        required: false
    },
    udyamNumber: {
        type: String,
        required: false
    },
    aboutUs: {
        type: String,
        required: false
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);