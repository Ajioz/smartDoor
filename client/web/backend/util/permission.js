import dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";

/*
const createJWT = ({ payload, options }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    ...defaultOptions,
    ...options,
  });
  return token;
};

export const sendResponseWithCookie = ({ res, statusCode, user, options }) => {
  const token = createJWT({ payload: { user }, options });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_LIFETIME * oneDay),
    signed: true,
    // secure flag later
  });
  res.status(statusCode).json({ user, token });
};
*/

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
