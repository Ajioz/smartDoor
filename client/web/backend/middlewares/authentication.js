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

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      req.user = { userId: decoded.userId, name: decoded.name }; 
    });

    next();

  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || "An error occurred during authentication",
    });
  }
};

export default auth;

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjFkNDNhNWM1ZWU3ZTQ4NTYyMzdlNWIiLCJuYW1lIjoiQWppcm9naGVuZSBTdW5kYXkgIiwiaWF0IjoxNzEzNzIxMTMzLCJleHAiOjE3MTM4MDc1MzN9.MkqGJtr23j4oaP1G-_HHaMkCbl5i2Hy8Zj0Hm7ZkzCQ
*/