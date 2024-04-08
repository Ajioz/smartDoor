import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js"
import UnauthenticatedError from "../errors/unAuthenticated.js";

export const signup = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email.trim() || !password.trim())
    throw new BadRequestError("Please provide email and password");

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Invalid credentials");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid credentials");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
