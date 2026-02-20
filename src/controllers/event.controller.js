import asyncHandler from "../utils/asyncHandler.js";
import eventService from "../services/event.service.js";

class EventController {

    getEvents = asyncHandler(async (req, res) => {

        const result = await eventService.getEvents(req.query);

        res.json({
            success: true,
            data: result.events,
            pagination: result.pagination
        });

    });

    getEventById = asyncHandler(async (req, res) => {

        const event = await eventService.getEventById(req.params.id);

        res.json({
            success: true,
            data: event
        });

    });

    importEvent = asyncHandler(async (req, res) => {

        const userId = req.user._id;

        const event = await eventService.importEvent(
            req.params.id,
            userId,
            req.body.notes
        );

        res.json({
            success: true,
            message: "Event imported",
            data: event
        });

    });

}

export default new EventController();
