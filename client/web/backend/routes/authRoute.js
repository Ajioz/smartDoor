import express from "express";
import {
  login,
  signup,
  confirmationPost,
  resendTokenPost,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/confirmation", confirmationPost);
authRouter.post("/resend", resendTokenPost);

export default authRouter;
