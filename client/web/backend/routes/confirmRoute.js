import express from "express";
import { confirm } from "../controllers/confirmController.js";

const confirmRouter = express.Router();

confirmRouter.get("/confirmation", confirm);
// authRouter.post("/resend", resendTokenPost);

export default confirmRouter;
