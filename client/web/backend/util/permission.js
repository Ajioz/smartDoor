import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";

export const sendResponseWithCookie = async(res, token) => {
  // Set JWT token lifetime to a day (in milliseconds)
  const oneDay = 1 * 24 * 60 * 60 * 1000;

    // Send a successful response with a secure cookie
    await res.cookie("token", token, {
      expires: new Date(Date.now() + oneDay),
      httpOnly: true,
      secure: true, // Set for HTTPS connections only (consider for production)
      signed: true,
    });
    // Respond with success status and additional data if needed
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login successful", token });
};

// export const checkPermissions = (user, item) => {
//   if (user.role === "admin") return true;
//   if (user.userId === item.user.toString()) return true;
//   return false;
// };