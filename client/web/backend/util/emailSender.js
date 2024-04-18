import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import BadRequestError from "../errors/badRequest.js";
import { StatusCodes } from "http-status-codes";

let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

/*
    01  Send Single Mail method
*/
const sendEmail = (subject, email, message, cb) => {
  const mailOptions = {
    from: process.env.EMAIL || "no-reply@smartDoor.io",
    to: email,
    subject,
    html: message,
  };
  transporter.sendMail(mailOptions, cb);
};

// Send Single Email controller
export const sendSingleEmail = async (
  res,
  email,
  token,
  host,
  user = "",
  regToken = "",
  spam=""
) => {
  const { message, subject } = MessageInfo(spam, token, host);
  try {
    sendEmail(subject, email, message, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: "Check Your Internet Connection!",
          server: err.responseCode,
        });
      } else {
        if (user) {
          user.save();
          regToken.save();
        }
        return res.status(StatusCodes.CREATED).json({
          message: `Verification link has been sent to ${data.envelope.to[0]}`,
          server: StatusCodes.CREATED,
          recipient: data.envelope.to[0],
        });
      }
    });
  } catch (error) {
    let errorMsg = "An error occurred during sending email";
    if (error instanceof BadRequestError) {
      errorMsg = error.message;
    } else {
      errorMsg = "Internal Server Error";
    }
    return res
      .status(StatusCodes.EXPECTATION_FAILED)
      .json({ Message: "We couldn't process your request" });
  }
};

const MessageInfo = (spam, token, host) => {
  if (spam)
    return {
      message: `<p>We detected a strange activity in your account</p>
      <p>If this was initiated by you, click the button below to verify your email address, otherwise please ignore!</p>
      <a href= http://${host}/api/user/${token} style="text-decoration: none;">
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Verify Email</button>
      </a>`,
      subject: "Unusual Activity Detected!",
    };
  else
    return {
      message: `<h4>Welcome to smartDoorIO</h4>
      <p>Please click the button below to verify your email address.</p>
      <a href= http://${host}/api/user/${token} style="text-decoration: none;">
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Verify Email</button>
      </a>`,
      subject: "Account Verification Token",
    };
};
