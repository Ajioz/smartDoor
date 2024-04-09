import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unAuthenticated.js";

export const signup = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email.trim() || !password.trim()) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid username");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid password");
    }
    const token = user.createJWT(); // Assuming createJWT() generates a token
    // Respond with success and token
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });

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
