import express from "express";
import { login, loginSchema, otpLogin, register, registerSchema, verifyOtp } from "../controllers/auth";
import { validate } from "../middleware/validate";


const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
// router.get("/token-verification", verifyToken)
router.post("/send-otp", otpLogin);
router.post("/verify-otp", verifyOtp);


export default router;
