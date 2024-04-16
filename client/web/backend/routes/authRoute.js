import express from "express";
import {
  confirmationPost,
  login,
  signup,
  resendTokenPost,
  findUserByEmail,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/email", findUserByEmail);
authRouter.get("/:tokenId", confirmationPost);
authRouter.post("/resend", resendTokenPost);

export default authRouter;

// $2a$10$/NiVETmdTGeIKHpNplNPEOOdg49rG.RUpsAaO24nHYY2vhgA.sPnS
// $2a$10$du.blD4Glo4HEUUfn/h22uQ7lcb0maRMb9qvDVoLYicA0Sha7mLJq
