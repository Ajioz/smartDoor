import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import Thing from "../models/ThingModel.js";
import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import NotFoundError from "../errors/notFound.js";
import { errorHandler } from "../util/errorHandler.js";


export const getUserThings = async (req, res) => {
  try {
    // console.log({ user: req.user.userId });
    const thing = await Thing.find({ user: req.user.userId });
    return res.status(StatusCodes.OK).json({ thing, count: thing.length });
  } catch (error) {
    console.log({ message: "Invalid or expired token" });
  }
};

export const getThing = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { id: thingId },
    } = req;
    const thing = await Thing.findOne({ _id: thingId, user: userId });

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    res.status(StatusCodes.OK).json({ thing });
  } catch (error) {
    console.log(error);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
};

export const createThing = async (req, res) => {
  try {
    req.body.user = req.user.userId;
    const thing = await Thing.create(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: `${thing.name} successfully created`, thing });
  } catch (error) {
    console.log(error);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
};

export const scanner = async (req, res) => {
  try {
    // Load the private key and passphrase from environment variables
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n"); // Handle multiline key
    const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");
    /* 
      // Production approach 
      import fs from "fs";
      const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, "utf8");
      const publicKey = fs.readFileSync(process.env.PUBLIC_KEY, "utf8");
    */
    const passphrase = process.env.PASSPHRASE;
    const payload = process.env.PAYLOAD;

    const {
      body: { finger },
      user: { userId },
    } = req;

    // Encrypt the message with the public key
    const encryptedPayload = crypto
      .publicEncrypt(publicKey, Buffer.from(payload))
      .toString("base64");

    // Sign the message
    const sign = crypto.createSign("SHA256");
    sign.update(encryptedPayload);
    sign.end();

    const signature = sign.sign({ key: privateKey, passphrase }, "base64");

    const user = await User.findOne({ _id: userId });
    if (!user) return;

    if (user.fingerID === finger) {
      return res
        .status(StatusCodes.OK)
        .json({ payload: encryptedPayload, signature });
    }
  } catch (error) {
    console.error(error.message);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
};

export const updateThing = async (req, res) => {
  try {
    const {
      body: { thingName, thingId },
      user: { userId },
    } = req;

    if (!thingName)
      throw new BadRequestError("Thing name fields cannot be empty");

    // Validate user ownership or permission for updating the thing
    const thing = await Thing.findOneAndUpdate(
      { _id: thingId, user: userId }, // Check for user ownership
      { name: thingName },
      { new: true, runValidators: true } // Update options with explanation (comment)
    );

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: `Successfully updated ${thingName}`, thing });
  } catch (error) {
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
};

export const deleteThing = async (req, res) => {
  try {
    const {
      user: { userId },
      params: { id: thingId },
    } = req;

    const thing = await Thing.findByIdAndRemove({
      _id: thingId,
      user: userId,
    });

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Successfully Removed item" });
  } catch (error) {
    console.log(error);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
};
