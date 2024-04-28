import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import BadRequestError from "../errors/badRequest.js";
import { StatusCodes } from "http-status-codes";
import fs from "fs/promises";

let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

/*   Load image to the image-buffer */
const logoBuffer = await fs.readFile(process.env.LOGO_PATH);

/* Send Single Mail method */
const sendEmail = (subject, email, message, cb) => {
  const mailOptions = {
    from: process.env.EMAIL || "no-reply@smartDoor.io",
    to: email,
    subject,
    html: message,
    attachments: [
      {
        filename: "logo4.webp",
        content: logoBuffer,
        cid: "logo4.webp",
        contentType: "image/webp",
      },
    ],
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
  spam = ""
) => {
  const { message, subject } = confirmEmail(spam, token, host);
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

let getEmailTemplate = (token, host) => {
  return `  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Confirmation</title>
      <style>
        text:hover {
          background-color: #096d8b;
          cursor: pointer;
          box-shadow: 0 0.4rem 1.4rem 0 rgba(86, 185, 235, 0.5);
          transform: translateY(-0.1rem);
          transition: transform 150ms;
        }
      </style>
    </head>
    <body style="
        font-family: sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f1f8e9;" >
      <div style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: #f1f8e9;
          border-radius: 5px;
          padding: 30px 90px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); " >
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin: 10px;">
          <img src="../img/logo4.png" alt="" style="width: 150px" />
        </div>
        <div style="
            display: flex;
            height: 3px;
            background: rgb(20, 232, 101);
            background: linear-gradient(
              88deg,
              rgba(20, 232, 101, 1) 0%,
              rgba(26, 218, 187, 1) 8%,
              rgba(11, 77, 228, 1) 17%,
              rgba(177, 53, 233, 1) 31%,
              rgba(219, 83, 236, 1) 44%,
              rgba(191, 92, 237, 1) 44%,
              rgba(241, 125, 207, 1) 55%,
              rgba(226, 31, 61, 1) 67%,
              rgba(233, 177, 87, 1) 75%,
              rgba(235, 172, 73, 1) 87%,
              rgb(196, 176, 4) 100%
            ); "></div>
        <div style="
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            width: 100%;">
          <h1 class="title" style="font-size: 18px; margin-left: 20px">
            Confirm Your Email !
          </h1>
        </div>
        <main style="line-height: 1.5">
          <p style="
              font-size: 12px;
              font-family: Arial, Helvetica, sans-serif;
              color: #56737c;">
            Please confirm it's you.
          </p>
          <p style="
              font-size: 12px;
              font-family: Arial, Helvetica, sans-serif;
              color: #56737c;" >
            You will need to click the below button to proceed on platform
            smartlock.io
          </p>
          <p style="
              font-size: 12px;
              font-family: Arial, Helvetica, sans-serif;
              color: #56737c; ">
            Please feel free to reach out to us anytime at care@smartlock.com for
            any questions or inquiries. We would love to hear your feedback.
          </p>
          <p style="
              font-size: 12px;
              font-family: Arial, Helvetica, sans-serif;
              color: #56737c;">
            Thanks for helping us improve smartlock for you!
          </p>
        </main>
        <div style="text-align: center; margin-top: 20px">
          <a
            href="http://${host}/api/user/${token}"
            style="text-decoration: none; color: #007bff" >
            <text
              type="button"
              style=" outline: none;
                padding: 15px;
                border-radius: 10px;
                background-color: #56737c;
                border: none;
                color: #fff;
                font-size: 12px;
                transition: 0.5s;">Go to smartLock</text>
          </a>
          <h4 style="
              color: #56737c;
              font-weight: 800;
              font-size: 12px !important;
              margin-top: 50px;" >
            smartLock, Inc.
          </h4>
          <p style="margin-bottom: 5px; font-size: 10px; color: #8c9597">
            Vintage Road Suite 190
          </p>
          <p style="margin-bottom: 5px; font-size: 10px; color: #8c9597">
            Los Gatos, CA 95232 United States
          </p>
          <p style="margin-bottom: 5px; font-size: 10px; color: #8c9597">
            Ask about anything via care@smartlock.io, To unsubscribe, please click
            here
          </p>
          <div>
            <h4 style="
                margin-bottom: 0;
                color: #56737c;
                font-weight: 800;
                font-size: 12px !important;
                margin-top: 20px;">
              Follow us on
            </h4>
            <div style="display: flex; justify-content: center">
              <a style="
                  color: #8c9597;
                  text-decoration: none;
                  margin-right: 10px;
                  font-size: 11px;"
                href="#">LinkedIn</a>
              <a style="
                  color: #8c9597;
                  text-decoration: none;
                  margin-right: 10px;
                  font-size: 11px;" 
                  href="#">Twitter</a>
              <a  style="
                  color: #8c9597;
                  text-decoration: none;
                  margin-right: 10px;
                  font-size: 11px;"
                  href="#">Youtube</a>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;
};

const confirmEmail = (spam, token, host) => {
  if (!spam)
    return {
      message: getEmailTemplate(token, host),
      subject: "Account Verification Token",
    };
  else
    return {
      message: getEmailTemplate(token, token),
      subject: "Unusual Activity Detected!",
    };
};

// const MessageInfo = (spam, token, host) => {
//   if (spam)
//     return {
//       message: `<p>We detected a strange activity in your account</p>
//       <p>If this was initiated by you, click the button below to verify your email address, otherwise please ignore!</p>
//       <a href= http://${host}/api/user/${token} style="text-decoration: none;">
//         <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Verify Email</button>
//       </a>`,
//       subject: "Unusual Activity Detected!",
//     };
//   else
//     return {
//       message: `<h4>Welcome to smartDoorIO</h4>
//       <p>Please click the button below to verify your email address.</p>
//       <a href= http://${host}/api/user/${token} style="text-decoration: none;">
//         <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Verify Email</button>
//       </a>`,
//       subject: "Account Verification Token",
//     };
// };
