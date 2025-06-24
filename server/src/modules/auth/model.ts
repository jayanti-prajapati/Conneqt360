import mongoose, { Schema, Model, Document } from "mongoose";
import { IUser, IAuthDocument, IAuthModel } from "../../types";

const authSchema = new Schema<IUser>({
  username: {
    type: String,
     unique: true,
    required: false,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  confirmPassword: {
    type: String,
    required: false,
  },
  businessName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
  },
  location: {
    type: String,
    required: false,
  },
  businessType: {
    type: String,
    required: false,
  },
  profileUrl: {
    type: String,
    required: false,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  connections: {
    type: Number,
    required: false,
  },
  products: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  gstNumber: {
    type: String,
    required: false,
  },
  udyamNumber: {
    type: String,
    required: false,
  },
  isSkip: {
    type: Boolean,
    required: false
  },
  aboutUs: {
    type: String,
    required: false,
  },
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
});

authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //this.password = await bcrypt.hash(this.password, 10); --convert password into hash
  next();
});

authSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  //return bcrypt.compare(candidatePassword, this.password);
  return candidatePassword === this.password;
};

authSchema.statics.findByPhone = function (phone: string) {
  return this.findOne({ phone });
};

//export const User = mongoose.model<IUser>('User', userSchema);
export const Register = mongoose.model<IUser>("register", authSchema);

// export const User = mongoose.model<IUserDocument, IUserModel>("User", authSchema);

export const User = mongoose.model<IAuthDocument, IAuthModel>(
  "User",
  authSchema
);
