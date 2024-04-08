import mongoose from "mongoose";

const thingSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dbName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Thing = mongoose.model("Thing", thingSchema);

export default Thing;
