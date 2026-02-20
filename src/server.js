import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
import logger from "./utils/logger.js";

// Register models
import "./models/Events.js";
import "./models/EmailOption.js";
import "./models/User.js";
import "./models/ImportLog.js";
import "./models/ScrapeLog.js";

import startScraperJob from "./jobs/scraper.job.js";


const startServer = async () => {

  await connectDB();

    startScraperJob();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });

};

startServer();
