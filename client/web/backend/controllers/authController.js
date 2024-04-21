import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import User from "../models/UserModel.js";
import Token from "../models/tokenModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unAuthenticated.js";
import DuplicateError from "../errors/duplicateError.js";
import { sendSingleEmail } from "../util/emailSender.js";
import { errorHandler } from "../util/errorHandler.js";
import { sendResponseWithCookie } from "../util/permission.js";
import NotFoundError from "../errors/notFound.js";
import Reset from "../models/resetModel.js";

const base_url = "http://localhost:3000";

/*
 * POST /registration
 */
export const signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) throw new DuplicateError("User Already Exist!");

    // create an a database bucket base on schema
    let user = new User({ name, username, email, password });

    // Create a verification token for this user
    const regToken = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    // Send the email
    sendSingleEmail(
      res,
      email,
      regToken.token,
      req.headers.host,
      user,
      regToken
    );
  } catch (error) {
    errorHandler(error, res, BadRequestError, UnauthenticatedError);
  }
};

/*
 * POST --> login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body)
    if (!email.trim() || !password.trim()) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError(
        "The email address " + email + " is not associated with any account."
      );
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect)
      throw new UnauthenticatedError("Invalid email or password");

    // Make sure the user has been verified
    if (!user.isVerified)
      throw new UnauthenticatedError("Your account has not been verified!");

    const token = await user.createJWT(); // createJWT() generates a token

    sendResponseWithCookie(res, token);
  } catch (error) {
    console.log(error);
    errorHandler(error, res, BadRequestError, UnauthenticatedError);
  }
};

/*
 * GET  --> confirmation
 */
export const confirmationPost = async (req, res) => {
  const { tokenId } = req.params;
  const { token, email } = findParams(tokenId);
  const validEmail = isEmail(email.trim());
  try {
    if (!validEmail) {
      // For someone trying to spam the system, recheck if the token is in email format
      const isSpam = isEmail(token.trim());
      if (isSpam) return res.redirect(`${base_url}`);

      // Find a matching token
      const token_ = await Token.findOne({ token });
      if (!token_) return res.redirect(302, `${base_url}/expired`); //"Unable to find a valid token. Your token may have expired."

      const user = await User.findOne({ _id: token_.userId });

      if (!user) return res.status(201).redirect(302, `${base_url}/register`);

      if (user.isVerified) {
        return res.status(201).redirect(302, `${base_url}/status`);
      }

      // Verify and save the user
      user.isVerified = true;
      await user.save();
      return res.redirect(302, `${base_url}/confirmed`);
    } else {
      if (validEmail) {
        // Find a matching token
        const isToken = await Reset.findOne({ token: tokenId });

        if (!isToken) return res.redirect(302, `${base_url}/expired`); //"Unable to find a valid token. Your token may have expired."

        const user = await User.findOne({ _id: isToken.userId });

        if (!user) return res.status(201).redirect(302, `${base_url}/register`);

        return res.redirect(
          `${base_url}/email?=${encodeURIComponent(
            JSON.stringify({ email, server: true })
          )}`
        );
      }
    }
  } catch (error) {
    errorHandler(error, res, BadRequestError, NotFoundError);
  }
};

// RESEND EMAIL
export const resendTokenPost = async (req, res) => {
  try {
    const { email, info } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError(
        `${email} is not associated with any account`
      );
    }
    let regToken = {};
    if (info !== "reset") {
      const tokenExist = await Token.findOne({ userId: user._id });
      if (!tokenExist) {
        regToken = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
      } else {
        regToken = tokenExist;
      }
    } else {
      regToken = await Reset.create({
        userId: user._id,
        token: `${crypto.randomBytes(16).toString("hex")}-${email}`,
      });
      // console.log(regToken)
    }
    return sendSingleEmail(res, email, regToken.token, req.headers.host);
  } catch (error) {
    errorHandler(error, res, BadRequestError, UnauthenticatedError);
  }
};

// Find user by email
export const findUserByEmail = async (req, res) => {
  const email = req.body.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError("No such user in our database");
    if (!user.isVerified) {
      // Create a verification token for this user
      const regToken = new Token({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      //save a new user token for the next 12 hours
      await regToken.save();
      // Send the email
      return sendSingleEmail(res, email, regToken.token, req.headers.host);
    }
    return res.status(200).json({ message: "confirmed" });
  } catch (error) {
    errorHandler(error, res, BadRequestError, DuplicateError);
  }
};

// UPDATE PROFILE FLOW

export const updateProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError(
        `The email address ${email} is not associated with any account.`
      );
    }
    user.password = password;
    await user.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Update was successful" });
  } catch (error) {
    errorHandler(error, res, UnauthenticatedError, DuplicateError);
  }
};

const isEmail = (email) => {
  // Regular expression pattern to match email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const findParams = (str) => {
  // Use indexOf to find the index of the dash
  const isDash = str.indexOf("-");
  // Check if a dash exists
  if (isDash === -1) {
    return { token: str, email: "" }; // Possibly a direct token, return token!
  }
  // Extract the first part (everything before the dash)
  const token = str.substring(0, isDash);
  // Extract the second part (everything after the dash)
  const email = str.substring(isDash + 1);
  return { token, email };
};
