import { StatusCodes } from "http-status-codes";

// class CustomAPIError extends Error {
//   constructor(message) {
//     super(message);
//   }
// }

// export default CustomAPIError;

class CustomAPIError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message); // Call the parent Error constructor with the message

    // Set the name of the error class for easier identification
    this.name = this.constructor.name;

    // Set the status code
    this.statusCode = statusCode;

    // Optionally include error code or additional properties
    // this.errorCode = 'UNIQUE_CONSTRAINT_VIOLATION'; // Example
  }

  // Optional methods to customize error handling (e.g., serialization)

  // serialize() {
  //   return {
  //     message: this.message,
  //     statusCode: this.statusCode,
  //   };
  // }
}

export default CustomAPIError;
