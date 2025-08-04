import { NextFunction, Request, Response } from "express";
const admin = require("firebase-admin");
import { z } from "zod";

import { AuthService } from "./service";
import { User } from "./model";
import { UserServicesService } from "../user-services/service";

const jwt = require("jsonwebtoken");

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  phone: z.string().min(10),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// OTP sending
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export interface OTPEntry {
  otp: string;
  expiry: number;
}

export const otpStore: { [phone: string]: OTPEntry } = {};

export class AuthController {
  private authService = new AuthService();
  private userService = new UserServicesService();

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, confirmPassword, phone } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }

      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        res.status(400).json({ message: "Phone number already registered" });
        return;
      }

      //const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.authService.register({
        email,
        password,
        confirmPassword,
        phone,
      });
      return res.status(200).json({
        statusCode: 201,
        message: "success",
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const users = await User.find().select("-password -confirmPassword");
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: users,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async getByPhone(req: Request, res: Response) {
    try {
      const phone = req.params.phone;

      console.log("Searching for phone:", phone);

      const phoneData = await User.findByPhone(phone);

      if (!phoneData) {
        return res.status(404).json({
          statusCode: 404,
          message: "Phone number not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: phoneData,
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      console.log("user", user);

      if (!user) {
        const errorMessage = "Email does not exist";
        return res.status(401).json({ message: errorMessage });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        const errorMessage = "Password not match";
        return res.status(401).json({ message: errorMessage });
      }

      const token = jwt.sign(
        { email: user?.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "none",
        path: "/",
      });
      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          businessName: user.businessName,
          businessType: user.businessType,
          token: token,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }

  async otpLogin(req: Request, res: Response) {
    // const serviceAccount = require('./firebaseServiceAccountKey.json');

    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount)
    // });

    const { phone } = req.body;

    if (!phone)
      return res.status(400).json({ error: "Phone number is required" });

    //   const user = await User.findOne({ phone });
    // if (!user) {
    //   return res.status(404).json({ message: "Phone number not registered" });
    // }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    try {
      // sendOTP(phone, parseInt(otp));
      otpStore[phone] = {
        otp,
        expiry: Infinity, //Date.now() + 5 * 60 * 1000, //5 min expiry
      };
      res.status(200).json({ message: "OTP sent successfully", otp }); // Return OTP only for dev/debug
    } catch (error) {
      res.status(400).json({ error: "Failed to send OTP" });
    }

    // if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // const otp = generateOTP();
    // try {
    //   sendOTP(phone, parseInt(otp));
    //   res.status(200).json({ message: 'OTP sent successfully', otp }); // Return OTP only for dev/debug
    // } catch (error) {
    //   res.status(500).json({ error: 'Failed to send OTP' });
    // }
  }

  async verifyOtp(req: Request, res: Response) {
    try {
      const { phone, otp } = req.body;

      let existingUser = await User.findOne({ phone });

      if (!existingUser) {
        existingUser = await this.authService.register({
          phone: phone,
          verified: true,
        });
      }
      console.log("exist", existingUser);
      
    await this.userService.create(existingUser._id.toString());
    
      const storedEntry = otpStore[phone];
      if (!storedEntry || storedEntry.otp !== otp) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }

      //clear otp after use
      delete otpStore[phone];

      const token = jwt.sign(
        { phone: existingUser.phone },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });
      const userObj = existingUser.toObject();

      res.status(200).json({
        message: "success",
        data: {
          ...userObj,
          token,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        statusCode: 400,
        message: "failed",
        error: error.message,
      });
    }
  }
}
