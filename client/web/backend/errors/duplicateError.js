import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customError.js";

class DuplicateError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.DUPLICATE_VALUE;
  }
}

export default DuplicateError;
