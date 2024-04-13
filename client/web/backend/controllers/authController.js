import crypto from "crypto";
import User from "../models/UserModel.js";
import Token from "../models/tokenModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unAuthenticated.js";
import DuplicateError from "../errors/duplicateError.js";
import { sendSingleEmail } from "../util/emailSender.js";
import { errorHandler } from "../util/errorHandler.js";

/*
 * POST /registration
 */
export const signup = async (req, res) => {
  const { email } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) throw new DuplicateError("User Already Exist!");

    let user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // Create a verification token for this user
    const regToken = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    const token = user.createJWT();
    await user.save();
    await regToken.save();

    // Send the email
    sendSingleEmail(email, regToken.token, req.headers.host);
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    errorHandler(error, res, BadRequestError, UnauthenticatedError);
  }
};

/*
 * POST /login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
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
        "Your account has not been verified. Verify your email with the link sent to you before expiration!"
      );
    const token = await user.createJWT(); // createJWT() generates a token
    // Respond with success and token
    // res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
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
 * POST /confirmation
 */
export const confirmationPost = async (req, res) => {
  try {
    // Find a matching token
    const { tokenId } = req.params;
    const token = await Token.findOne({ token: tokenId });
    if (!token) return res.redirect(302, "http://localhost:3000/expired"); //"Unable to find a valid token. Your token may have expired."
    const user = await User.findOne({ _id: token.userId });
    if (!user)
      throw new BadRequestError(
        "We were unable to find a user for this token."
      );
    if (user.isVerified)
      return res.redirect(302, "http://localhost:3000/status");

    //   throw new DuplicateError("This user has already been verified.");
    // // Verify and save the user
    user.isVerified = true;
    await user.save();
    res.redirect(302, "http://localhost:3000/confirmed");
  } catch (error) {
    errorHandler(error, res, BadRequestError, DuplicateError);
  }
};

// Resend

export const resendTokenPost = async (req, res) => {
  console.log({ msg: "email resent" });
  return res.status(200).json({ msg: "email resent" });
};
