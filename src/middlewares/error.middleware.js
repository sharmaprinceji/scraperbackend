import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {

  logger.error(err.stack || err.message);

  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // Validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack
    })
  });

};

export default errorMiddleware;
