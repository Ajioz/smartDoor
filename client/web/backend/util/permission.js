import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";


export const sendResponseWithCookie = ({ res, statusCode, token }) => {
  // Set JWT token lifetime to 10 days (in milliseconds)
  const tenDays = 10 * 24 * 60 * 60 * 1000;

  // Send a successful response with a secure cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + tenDays),
    // secure: true, // Set for HTTPS connections only (consider for production)
    signed: true,
  });
  // Respond with success status and additional data if needed
  return res
    .status(statusCode)
    .json({ success: true, message: "Login successful"});
};

export const checkPermissions = (user, item) => {
  if (user.role === "admin") return true;
  if (user.userId === item.user.toString()) return true;
  return false;
};


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

    const tenDays = 10 * 24 * 60 * 60 * 1000;

    // Send a successful response with a secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + tenDays),
      // secure: true, // Set for HTTPS connections only (consider for production)
      signed: true,
    });
    // Respond with success status and additional data if needed
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login successful" });
  } catch (error) {
    errorHandler(error, res, BadRequestError, UnauthenticatedError);
  }
};