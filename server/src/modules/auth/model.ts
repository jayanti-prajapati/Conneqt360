import mongoose, { Schema, Model , Document  } from 'mongoose';
import { IUser, IUserDocument, IUserModel } from '../../types';



// export interface IUser extends Document {
//   email: string;
//   password: string;
//   businessName: string;
//   phone: string;
//   // location?: string;
//   businessType?: string;
//   verified: boolean;
//   gstNumber?: string;
//   confirmPassword: String,


//   udyamNumber?: string;
//   interests: string[];
//   createdAt: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }






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
  confirmPassword: {
    type: String,
    required: false,
  },
  // businessName: {
  //   type: String,
  //   required: true,
  // },
  phone: {
    type: String,
    required: false,
  },
  // location: {
  //   type: String,
  //   required: true,
  // },
  // businessType: {
  //   type: String,
  //   required: true,
  // },
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //this.password = await bcrypt.hash(this.password, 10); --convert password into hash
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  //return bcrypt.compare(candidatePassword, this.password);
  return candidatePassword === this.password;
};



userSchema.statics.findByPhone = function (phone: string) {
  return this.findOne({ phone });
};

//export const User = mongoose.model<IUser>('User', userSchema);
export const Register = mongoose.model<IUser>('register', userSchema);

export const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
