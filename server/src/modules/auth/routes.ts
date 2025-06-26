import express from "express";
import { validate } from "../../middleware/validate";
import { AuthController, loginSchema, registerSchema } from "./controller";
import verifyToken from "../../middleware/token";

const router = express.Router();
const authController = new AuthController();

router.post("/register", validate(registerSchema), authController.register.bind(authController));
router.post("/login", validate(loginSchema), authController.login.bind(authController));
router.post("/send-otp", authController.otpLogin.bind(authController));
router.post("/verify-otp", authController.verifyOtp.bind(authController));
router.post("/token-verification", verifyToken);
router.get("/", authController.getAll);
// router.get("/:phone", authController.getByPhone);



export default router;
