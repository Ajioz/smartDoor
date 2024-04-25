import Thing from "../models/ThingModel.js";
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
  // const { userId } = req.user;
  // const { id: thingId } = req.params;
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
      { _id: thingId, user: req.user.userId }, // Check for user ownership
      { name: thingName },
      { new: true, runValidators: true } // Update options with explanation (comment)
    );

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    return res.status(StatusCodes.CREATED).json(thing);
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
      user: req.user.userId,
    });

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    res.status(StatusCodes.OK).send("Successfully Removed thing");
  } catch (error) {
    console.log(error);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
};
