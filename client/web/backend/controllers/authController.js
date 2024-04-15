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
      throw new UnauthenticatedError(
        "Your account has not been verified!"
      );
    
    const token = await user.createJWT(); // createJWT() generates a token

    // Respond with success and token
    sendResponseWithCookie({
      res,
      statusCode: StatusCodes.OK,
      token,
    });
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

  try {
    // Find a matching token
    const token = await Token.findOne({ token: tokenId });
    if (!token) return res.redirect(302, `${base_url}/expired`); //"Unable to find a valid token. Your token may have expired."

    const user = await User.findOne({ _id: token.userId });

    if (!user)
      throw new BadRequestError(
        "We were unable to find a user for this token."
      );

    if (user.isVerified) return res.redirect(302, `${base_url}/status`);

    // Verify and save the user
    user.isVerified = true;
    await user.save();
    return res.redirect(302, `${base_url}/confirmed`);
  } catch (error) {
    errorHandler(error, res, BadRequestError, DuplicateError);
  }
};

// Resend
export const resendTokenPost = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError(
        "The email address " + email + " is not associated with any account."
      );
    }
    const tokenExist = await Token.findOne({ userId: user._id });
    let regToken;
    if (!tokenExist) {
      console.log("regToken doesn't exist: creating one...");
      regToken = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
    } else {
      regToken = tokenExist;
      console.log("regToken exist: ", regToken);
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
