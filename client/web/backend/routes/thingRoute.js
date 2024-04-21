import express from "express";
import {
  getUserThings,
  getThing,
  createThing,
  updateThing,
  deleteThing,
} from "../controllers/thingController.js";

const thingRouter = express.Router();

thingRouter.route("/").post(getUserThings).post(createThing);
thingRouter.route("/:id").get(getThing).patch(updateThing).delete(deleteThing);

export default thingRouter;
