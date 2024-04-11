import { StatusCodes } from "http-status-codes";

export const errorHandler = (error, res, errorType1, errorType2) => {
  let errorMessage = "An error occurred";
  if (error instanceof errorType1) {
    errorMessage = error.message; // Use the custom error message
  } else if (error instanceof errorType2) {
    errorMessage = error.message;
  } else {
    // Handle other unexpected errors (consider logging details)
    errorMessage = "Internal Server Error";
  }
  // Send a user-friendly error response with status code
  res
    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: errorMessage, url: `http://localhost:3000/` });
};
