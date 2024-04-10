import crypto from "crypto"
import User from "../models/UserModel.js";
import Token from "../models/tokenModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unAuthenticated.js";
import DuplicateError from "../errors/duplicateError.js";
import { sendSingleEmail } from "../util/emailSender.js";

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
    console.log(error);  //print error for debugging purposes
    let errorMessage = "An error occurred during login.";
    if (error instanceof DuplicateError) {
      errorMessage = error.message; // Use the custom error message
    } else {
      // Handle other unexpected errors (consider logging details)
      errorMessage = "Internal Server Error";
    }
    // Send a user-friendly error response with status code
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: errorMessage });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email.trim() || !password.trim()) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("The email address " + email + " is not associated with any account.");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid email or password");
    }
    // Make sure the user has been verified
    if (!user.isVerified)
      throw new UnauthenticatedError({
        type: "not-verified",
        msg: "Your account has not been verified.",
      });
    const token = user.createJWT(); // Assuming createJWT() generates a token
    // Respond with success and token
    // res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
    // res, statusCode, user, options --> res, statusCode, token
    sendResponseWithCookie({
      res,
      statusCode: StatusCodes.OK,
      token,
    });
  } catch (error) {
    // Handle errors appropriately, providing user-friendly messages
    console.error(error); // Log the error for debugging
    let errorMessage = "An error occurred during login.";
    if (error instanceof BadRequestError) {
      errorMessage = error.message; // Use the custom error message
    } else if (error instanceof UnauthenticatedError) {
      errorMessage = error.message; // Use the custom error message
    } else {
      // Handle other unexpected errors (consider logging details)
      errorMessage = "Internal Server Error";
    }
    // Send a user-friendly error response with status code
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: errorMessage });
  }
};
