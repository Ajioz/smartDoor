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

// $2a$10$/NiVETmdTGeIKHpNplNPEOOdg49rG.RUpsAaO24nHYY2vhgA.sPnS
// $2a$10$du.blD4Glo4HEUUfn/h22uQ7lcb0maRMb9qvDVoLYicA0Sha7mLJq
