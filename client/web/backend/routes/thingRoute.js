import express from "express";
import {
  getAllThings,
  getThing,
  createThing,
  updateThing,
  deleteThing,
} from "../controllers/thingController.js";

const thingRouter = express.Router();

thingRouter.route("/").get(getAllThings).post(createThing);
thingRouter.route("/:id").get(getThing).patch(updateThing).delete(deleteThing);

export default thingRouter;
