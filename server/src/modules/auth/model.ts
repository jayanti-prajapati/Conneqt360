import mongoose, { Schema, Model , Document  } from 'mongoose';
import { IUser, IAuthDocument, IAuthModel } from '../../types';


const authSchema = new Schema<IUser>({
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

authSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  //this.password = await bcrypt.hash(this.password, 10); --convert password into hash
  next();
});

authSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  //return bcrypt.compare(candidatePassword, this.password);
  return candidatePassword === this.password;
};



authSchema.statics.findByPhone = function (phone: string) {
  return this.findOne({ phone });
};

//export const User = mongoose.model<IUser>('User', userSchema);
export const Register = mongoose.model<IUser>('register', authSchema);

// export const User = mongoose.model<IUserDocument, IUserModel>("User", authSchema);

export const Auth = mongoose.model<IAuthDocument, IAuthModel>("Auth", authSchema);
