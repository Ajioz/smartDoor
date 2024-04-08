import dotenv from "dotenv"
dotenv.config();
import  verifySign  from "jsonwebtoken";
import UnauthenticatedError from "../errors/unAuthenticated.js";

const { verify } = verifySign;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const verifyToken = verify(token, process.env.JWT_SECRET);

    //attach the user to the job routes
    //req.user = User.findById(verifyToken.id).select('-password')        // MEthod: 1

    req.user = { userId: verifyToken.userId, name: verifyToken.name }; // MEthod: 2
    next();
  } catch (error) {
    throw new UnauthenticatedError("Error in Authenticating user");
  }
};

export default auth;
