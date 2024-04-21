import Thing from "../models/ThingModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import NotFoundError from "../errors/notFound.js";
import { errorHandler } from "../util/errorHandler.js";


export const getUserThings = async (req, res) => {
  // console.log(req.body);
  try {
    console.log({ user: req.user.userId });
    const thing = await Thing.find({ user: req.user.userId }).sort({ _id: -1 });
    return res.status(StatusCodes.OK).json({ thing, count: thing.length });
  } catch (error) {
    console.log({ msg: "error" });
  }
};

export async function getThing(req, res) {
  // const { userId } = req.user;
  // const { id: thingId } = req.params;
  try {
    const {
      user: { userId },
      params: { id: thingId },
    } = req;
    const thing = await Thing.findOne({ _id: thingId, user: req.user.userId });

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    res.status(StatusCodes.OK).json({ thing });
  } catch (error) {
    console.log(error);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
}

export async function createThing(req, res) {
  // req.body = req.user.userId;
  req.body.user = req.user.userId;
  console.log({ thing: req.body });
  const thing = await Thing.create(req.body);
  res.status(StatusCodes.CREATED).json({ thing });
}

export async function updateThing(req, res) {
  try {
    const {
      body: { company, position },
      user: { userId },
      params: { id: thingId },
    } = req;
    if (company === "" || position === "")
      throw new BadRequestError("Company or Position fields cannot be empty");
    const thing = await Thing.findByIdAndUpdate(
      { _id: thingId, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

    res.status(StatusCodes.OK).json(thing);
  } catch (error) {
    console.log(error);
    errorHandler(error, res, NotFoundError, BadRequestError);
  }
}

export async function deleteThing(req, res) {
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
}
