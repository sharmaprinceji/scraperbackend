import express from "express";
import eventController from "../controllers/event.controller.js";
import scraperService from "../services/scraper.service.js";
import requireAuth from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/role.middleware.js";

const router = express.Router();


// PUBLIC ROUTES

// 1. Scrape route FIRST
router.get("/scrape-eventbrite", async (req, res) => {

  await scraperService.scrapeEventbriteSydney();

  res.json({
    success: true,
    message: "Eventbrite scraping completed"
  });

});


// 2. Get all events
router.get("/", eventController.getEvents);


// 3. Import event (admin)
router.post(
  "/import/:id",
  requireAuth,
  requireAdmin,
  eventController.importEvent
);


// 4. Get single event (ALWAYS LAST)
router.get("/:id", eventController.getEventById);


export default router;