import dotenv from "dotenv";
dotenv.config();
import { Schema, model } from "mongoose";
import helpers from "bcryptjs";
import jsonSign from "jsonwebtoken";

const { hash, compare } = helpers;
const { sign } = jsonSign;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
    minLength: 3,
    maxLength: 20,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
  },
});

UserSchema.pre("save", async function () {
  this.password = await hash(this.password, 10);
});

UserSchema.methods.createJWT = function () {
  return sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password);
};

export default model("User", UserSchema);
