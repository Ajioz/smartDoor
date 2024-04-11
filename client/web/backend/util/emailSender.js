import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import BadRequestError from "../errors/badRequest.js";

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
    text: message,
  };
  transporter.sendMail(mailOptions, cb);
};

// Send Single Email controller
export const sendSingleEmail = async (email, token, host) => {
  const message =
    "Hello,\n\n" +
    "Please verify your account by clicking the link: \nhttp://" +
    host +
    "/api/user/" +
    token +
    ".\n";
  const subject = "Account Verification Token";
  try {
    sendEmail(subject, email, message, (err, data) => {
      if (err) throw new BadRequestError("Authentication Server failed");
      else
        return res
          .status(200)
          .send("A verification email has been sent to " + email + ".");
    });
  } catch (error) {
    console.error(error);
    let errorMsg = "An error occurred during sending email";
    if (error instanceof BadRequestError) {
      errorMsg = error.message;
    } else {
      errorMsg = "Internal Server Error";
    }
    return res
      .status(400)
      .json({ Message: "We couldn't process your request" });
  }
};
