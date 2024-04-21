import express from "express";
import {
  confirmationPost,
  login,
  signup,
  resendTokenPost,
  findUserByEmail,
  updateProfile,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/:tokenId", confirmationPost);
authRouter.post("/resend", resendTokenPost);
authRouter.post("/email", findUserByEmail);
authRouter.post("/password", updateProfile);

export default authRouter;