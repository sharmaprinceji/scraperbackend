import winston from "winston";
import fs from "fs";
import path from "path";

const logDir = "logs";

// create logs directory if not exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const isProduction = process.env.NODE_ENV === "production";

// Common formats
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger
const logger = winston.createLogger({

  level: isProduction ? "info" : "debug",

  format: isProduction ? prodFormat : devFormat,

  defaultMeta: {
    service: "event-scraper-backend"
  },

  transports: [

    // Console transport
    new winston.transports.Console({
      handleExceptions: true
    }),

    // Error file
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5
    })

  ],

  exitOnError: false

});

// Stream for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

export default logger;
