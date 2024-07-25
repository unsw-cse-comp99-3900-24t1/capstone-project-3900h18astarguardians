import {
  login,
  logout,
  verifyEmail,
  register,
} from "../controllers/authController";
import { Router } from "express";
const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);
router.route("/verify-email").post(verifyEmail);
export { router as authRouter };
