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

    // Respond with success and token
    sendResponseWithCookie({
      res,
      statusCode: StatusCodes.OK,
      token,
    });
  } catch (error) {
    errorHandler(error, res, BadRequestError, UnauthenticatedError);
  }
};

/*
 * GET  --> confirmation
 */
export const confirmationPost = async (req, res) => {
  const { tokenId } = req.params;

  try {
    const validEmail = isEmail(tokenId);
    if (!validEmail) {
      // Find a matching token
      const token = await Token.findOne({ token: tokenId });
      if (!token) return res.redirect(302, `${base_url}/expired`); //"Unable to find a valid token. Your token may have expired."

      const user = await User.findOne({ _id: token.userId });

      if (!user)
        throw new BadRequestError(
          "We were unable to find a user for this token."
        );

      if (user.isVerified) {
        return res.status(201).redirect(302, `${base_url}/status`);
      }

      // Verify and save the user
      user.isVerified = true;
      await user.save();
      return res.redirect(302, `${base_url}/confirmed`);
    } else {
      if (validEmail) {
        return res.status(200).json({ email: tokenId, server: 200 });
      }
    }
    throw new NotFoundError("Resource not found");
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
      regToken.token = email;
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

function isEmail(email) {
  // Regular expression pattern to match email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
