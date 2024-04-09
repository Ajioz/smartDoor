import dotenv from "dotenv";
dotenv.config();
import verifySign from "jsonwebtoken";
import UnauthenticatedError from "../errors/unAuthenticated.js";

const { verify } = verifySign;


const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    const token = authHeader.split(" ")[1];
    const verifyToken = verify(token, process.env.JWT_SECRET);
    // Attach user information to the request (choose one method)
    // req.user = await User.findById(verifyToken.id).select('-password'); // Method 1
    req.user = { userId: verifyToken.userId, name: verifyToken.name }; // Method 2
    next();
  } catch (error) {
    // console.error(error); // Log error for debugging
    // Send appropriate error response to the user
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "An error occurred during authentication",
    });
  }
};

export default auth;