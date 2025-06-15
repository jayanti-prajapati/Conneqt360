import { NextFunction, Request, Response } from "express";
import { User } from '../models/User';
const admin = require('firebase-admin');
import { z } from "zod";
// OTP sending
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
import { sendOTP } from '../services/otpService';
const jwt = require("jsonwebtoken");

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  // businessName: z.string().min(2),
  phone: z.string().min(10),
  // location: z.string(),
  // businessType: z.string()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});


export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, confirmPassword, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: password,
      confirmPassword: confirmPassword,
      phone,
      // location,
      // businessType
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("user", user);

    if (!user) {
      res.status(401).json({ message: "Invalid User" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Password not match" });
      return;
    }

    const token = jwt.sign(
      { email: user.email },
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

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        // businessName: user.businessName,
        phone: user.phone,
        // location: user.location,
        // businessType: user.businessType,
        verified: user.verified,
        token: token
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

interface OTPEntry {
  otp: string;
  expiry: number;
}

export const otpStore: { [phone: string]: OTPEntry } = {};


// Adjust the import path as necessary

export const otpLogin = async (req: Request, res: Response) => {

  const serviceAccount = require('./firebaseServiceAccountKey.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  res.status(200).json({ message: 'OTP request initiated on client', phone });
  // try {


  // const user = await User.findOne({ phone });
  // if (!user) {
  //   return res.status(404).json({ message: "Mobile number not registered" });
  // }

  //const otp = generateOTP();

  //   const otp = "12345";

  //   otpStore[phone] = {
  //     otp,
  //     expiry: Infinity,  //Date.now() + 5 * 60 * 1000, //5 min expiry
  //   };

  //   console.log(`Otp for ${phone}: ${otp}`);
  //   res.status(200).json({ message: "OTP sent to your mobile number" });

  // } catch (error: any) {
  //   console.error("sendOtp error:", error);
  //   res.status(500).json({ message: "Failed to send OTP", error: error.message });
  // }
  // const { phone } = req.body;

  // if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  // const otp = generateOTP();
  // try {
  //   sendOTP(phone, parseInt(otp));
  //   res.status(200).json({ message: 'OTP sent successfully', otp }); // Return OTP only for dev/debug
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to send OTP' });
  // }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ message: "Mobile number not registered" });
    }

    const storedEntry = otpStore[phone];
    if (
      !storedEntry ||
      storedEntry.otp !== otp) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    //clear otp after use
    delete otpStore[phone];

    const token = jwt.sign(
      { email: user.email },
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

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        businessName: user.businessName,
        businessType: user.businessType,
        verified: user.verified,
        token,
      },
    });
  } catch (error: any) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};



