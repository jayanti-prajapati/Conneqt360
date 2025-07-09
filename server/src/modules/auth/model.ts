import mongoose, { Schema, Model, Document } from "mongoose";
import { IUser, IAuthDocument, IAuthModel } from "../../types";

const authSchema = new Schema<IUser>({
  name: {
    type: String,
    required: false,
    default: null,
  },
  username: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: false,
    // unique: true,
    trim: true,
    default: null,
  },
  // password: {
  //   type: String,
  //   required: false,
  // },
  // confirmPassword: {
  //   type: String,
  //   required: false,
  // },
  jobTitle: {
    type: String,
    required: false,
    default: null,
  },
  referrels: {
    type: Number,
    required: false,
    default: null,
  },
  businessName: {
    type: String,
    required: false,
    default: null,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    default: null,
  },
  location: {
    type: String,
    required: false,
    default: null,
  },
  businessType: {
    type: String,
    required: false,
    default: null,
  },
  businessEmail: {
    type: String,
    required: false,
    default: null,
  },
  website: {
    type: String,
    required: false,
    default: null,
  },
  address: {
    type: String,
    required: false,
    default: null,
  },
  city: {
    type: String,
    required: false,
    default: null,
  },
  state: {
    type: String,
    required: false,
    default: null,
  },
  postalCode: {
    type: Number,
    required: false,
    default: null,
  },
  country: {
    type: String,
    required: false,
    default: null,
  },
  socialMedia: {
  type: Object,
  required: false,
  default: null,
},

 services: {
  type: [String],
  required: false,
  default: [],
},
 clients: {
  type: [
    {
      id: String,
      name: String,
      logo: String,
      testimonial: String,
      rating: Number,
      projectType: String,
      completedDate: Date,
    },
  ],
  required: false,
  default: [],
},
  // catalog: {
  //   type: String,
  //   required: false,
  //   default: null,
  // },
  followersCount: {
    type: Number,
    required: false,
    default: null,
  },
  postsCount: {
    type: Number,
    required: false,
    default: null,
  },
  isOnline: {
    type: Boolean,
    required: false,
    default: null,
  },
  lastSeen: {
    type: Date,
    required: false,
    default: null,
  },
  profileUrl: {
    type: String,
    required: false,
    default: null,
  },
  thumbnail: {
    type: String,
    required: false,
    default: null,
  },
  connections: {
    type: Number,
    required: false,
    default: null,
  },
  products: {
    type: Number,
    required: false,
    default: null,
  },
  rating: {
    type: Number,
    required: false,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  gstNumber: {
    type: String,
    required: false,
    default: null,
  },
  udyamNumber: {
    type: String,
    required: false,
    default: null,
  },
  isSkip: {
    type: Boolean,
    required: false,
    default: null,
  },
  aboutUs: {
    type: String,
    required: false,
    default: null,
  },
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
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

authSchema.statics.findByPhone = function (
  phone: string,
  extraFilter: any = {}
) {
  return this.findOne({ phone, ...extraFilter });
};

export const Register = mongoose.model<IUser>("register", authSchema);

export const User = mongoose.model<IAuthDocument, IAuthModel>(
  "User",
  authSchema
);
