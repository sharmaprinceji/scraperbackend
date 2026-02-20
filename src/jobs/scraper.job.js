import cron from "node-cron";
import scraperService from "../services/scraper.service.js";
import logger from "../utils/logger.js";

const startScraperJob = () => {

  cron.schedule("0 */6 * * *", async () => {

    logger.info("Running Eventbrite scraper...");

    await scraperService.scrapeEventbriteSydney();

  });

};

export default startScraperJob;
