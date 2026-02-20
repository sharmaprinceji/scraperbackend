import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import passport from "./config/passport.js";

import eventRoutes from "./routes/event.routes.js";
import emailOptinRoutes from "./routes/emailOptin.routes.js";
import authRoutes from "./routes/auth.routes.js";

import { env } from "./config/env.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import logger from "./utils/logger.js";

const app = express();


// Trust proxy (important for auth sessions)
app.set("trust proxy", 1);


// Security middleware
app.use(helmet());


// Body parser
app.use(express.json());


// CORS (MUST be before session)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


// Session middleware (MUST be before routes)
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// HTTP logger
app.use(
  morgan("combined", {
    stream: logger.stream
  })
);


// Health route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Event Scraper API is running"
  });
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

// FIXED route name (was wrong before)
app.use("/api/email-optin", emailOptinRoutes);


// 404 middleware
app.use(notFound);


// Error middleware (ALWAYS LAST)
app.use(errorMiddleware);


export default app;