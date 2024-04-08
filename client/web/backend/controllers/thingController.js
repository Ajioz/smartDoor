import Thing from "../models/ThingModel.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/badRequest.js";
import NotFoundError from "../errors/notFound.js";

export const getAllThings = async(req, res) => {
  const thing = await Thing.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ thing, count: thing.length });
}

export async function getThing(req, res) {
  // const { userId } = req.user;
  // const { id: thingId } = req.params;

  const {
    user: { userId },
    params: { id: thingId },
  } = req;

  const thing = await Thing.findOne({ _id: thingId, createdBy: userId });

  if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

  res.status(StatusCodes.OK).json({ thing });
}

export async function createThing(req, res) {
  req.body.createdBy = req.user.userId;
  const thing = await Thing.create(req.body);
  res.status(StatusCodes.CREATED).json({ thing });
}

export async function updateThing(req, res) {
  const {
    body: { company, position },
    user: { userId },
    params: { id: thingId },
  } = req;
  if (company === "" || position === "")
    throw new BadRequestError("Company or Position fields cannot be empty");

  const thing = await Thing.findByIdAndUpdate(
    { _id: thingId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

  res.status(StatusCodes.OK).json(thing);
}

export async function deleteThing(req, res) {
  const {
    user: { userId },
    params: { id: thingId },
  } = req;

  const thing = await Thing.findByIdAndRemove({
    _id: thingId,
    createdAt: userId,
  });

  if (!thing) throw new NotFoundError(`No thing with id: ${thingId}`);

  res.status(StatusCodes.OK).send("Successfully Removed thing");
}
