import dotenv from "dotenv";
dotenv.config();
import verifySign from "jsonwebtoken";
import UnauthenticatedError from "../errors/unAuthenticated.js";

const { verify } = verifySign;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthenticatedError("Authentication invalid");
    }

    const token = authHeader.split(" ")[1];

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid or expired token" });
      req.user = { userId: decoded.userId, name: decoded.name };
    });

    next();
  } catch (error) {
    // console.log(error)
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "An error occurred during authentication",
    });
  }
};

export default auth;
