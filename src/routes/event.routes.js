import express from "express";
import eventController from "../controllers/event.controller.js";
import scraperService from "../services/scraper.service.js";
import requireAuth from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/role.middleware.js";

const router = express.Router();


router.get("/scrape-eventbrite", async (req, res) => {

  await scraperService.scrapeEventbriteSydney();

  res.json({
    success: true,
    message: "Eventbrite scraping completed"
  });

});


router.get("/", eventController.getEvents);
router.post(
  "/import/:id",
  requireAuth,
  requireAdmin,
  eventController.importEvent
);

router.get("/:id", eventController.getEventById);


export default router;