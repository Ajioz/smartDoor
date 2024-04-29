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
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Confirmation</title>
        <style>
        .btn:hover {
            background-color: #096d8b;
            box-shadow: 0 0.4rem 1.4rem 0 rgba(86, 185, 235, 0.5);
            transform: translateY(-0.1rem);
            transition: transform 150ms;
        }
      </style>
      </head>
      <body>
        <div style="display: block;background-color: #f1f8e9; border-radius: 5px;  padding: 30px 90px; max-width: 600px;
          width: 100%; margin: 0 auto; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <div style=" text-align: center; margin: 10px 0; ">
            <img src="../img/logo4.png" alt="" />
          </div>
          <div style=" height: 3px;
          background: rgb(20, 232, 101);
          background: linear-gradient(88deg, rgba(20, 232, 101, 1) 0%, rgba(26, 218, 187, 1) 8%, rgba(11, 77, 228, 1) 17%, rgba(177, 53, 233, 1) 31%, rgba(219, 83, 236, 1) 44%, rgba(191, 92, 237, 1) 44%, rgba(241, 125, 207, 1) 55%, rgba(226, 31, 61, 1) 67%, rgba(233, 177, 87, 1) 75%, rgba(235, 172, 73, 1) 87%, rgb(196, 176, 4) 100%);"></div>
          <div class="header">
            <h1 style="text-align: center; color: #333; font-size: 14px;  font-size: 18px; margin: 20px;">
                Confirm Your Email
            </h1>
          </div>
          <main>
            <p style="line-height: 1.5; font-size: 13px; color:#4b6a74; margin-bottom: 10px;">Please confirm it's you.</p>
            <p style="line-height: 1.5; font-size: 13px; color:#4b6a74; margin-bottom: 10px;">
              You will need to click the below button to proceed on platform
              <a href="https://smartlock.io" style="color:#56737c; text-decoration: underline;">smartlock.io</a> 
            </p>
            <p style="line-height: 1.5; font-size: 13px; color:#4b6a74; margin-bottom: 10px;">
              Please feel free to reach out to us anytime at <a href="mailto: care@smartlock.com" style="color:#56737c; text-decoration: underline;">care@smartlock.com</a> for
              any questions or inquiries. We would love to hear your feedback.
            </p>
            <p style="line-height: 1.5; font-size: 13px; color:#4b6a74; margin-bottom: 10px;">Thanks for helping us improve smartlock for you!</p>
          </main>
          <div style="  text-align: center; margin-top: 20px;">
          <a href= http://${host}/api/user/${token} style="text-decoration: none;">
            <button class="btn" style="outline: none; padding: 15px; border-radius: 10px;background-color: #56737c;border:  none;color: #fff;font-size: 12px;margin: 40px auto;transition: 0.5s;cursor: pointer;display: inline-block;" >
                Go to smartLock
            </button>
          </a>
            <h4 style="margin:0px auto 3px auto;color:#56737c;font-weight:800;font-size:12px; margin-top:0;">
                smartLock, Inc.
            </h4>
            <p style="margin: 0; margin-bottom: 5px; font-size: 10px; color: #8c9597;">Vintage Road Suite 190</p>
            <p style="margin: 0; margin-bottom: 5px; font-size: 10px; color: #8c9597;">Los Gatos, CA 95232 United States</p>
            <p style="margin: 0; margin-bottom: 5px; font-size: 10px; color: #8c9597;">
              Ask about anything via care@smartlock.io, To unsubscribe, please <a href="https:smartlock.io" style="text-decoration: underline; color: #56737c;">click
              here</a>
            </p>
            <div style="margin: 20px auto 0 auto;">
              <h4 style="margin: 0;  color: #56737c; font-weight: 800; font-size: 12px;margin-top: 0;">Follow us on</h4>
              <a style="color: #8c9597;text-decoration: none; margin-right: 10px; font-size: 11px;" href="#"> LinkedIn</a>
              <a style="color: #8c9597;text-decoration: none; margin-right: 10px; font-size: 11px;" href="#"> Twitter</a>
              <a style="color: #8c9597;text-decoration: none; margin-right: 10px; font-size: 11px;" href="#"> Youtube</a>
            </div>
          </div>
        </div>
      </body>
    </html>`;
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
