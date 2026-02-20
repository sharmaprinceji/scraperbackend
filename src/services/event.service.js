import Event from "../models/Events.js";
import ImportLog from "../models/ImportLog.js";

class EventService {

  async getEvents(query) {

    const {
      page = 1,
      limit = 10,
      city,
      keyword,
      startDate,
      endDate,
      status,
      sortBy = "dateTime",
      sortOrder = "asc"
    } = query;

    const filter = {};

    // City filter
    if (city) {
      filter.city = city;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Keyword search
    if (keyword) {

      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { venueName: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];

    }

    // Date range filter
    if (startDate || endDate) {

      filter.dateTime = {};

      if (startDate) {
        filter.dateTime.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.dateTime.$lte = new Date(endDate);
      }

    }

    // Sorting
    const sort = {
      [sortBy]: sortOrder === "desc" ? -1 : 1
    };

    const skip = (page - 1) * limit;

    const events = await Event.find(filter)
      .populate("importedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Event.countDocuments(filter);

    return {

      events,

      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }

    };

  }

  async getEventById(eventId) {

    const event = await Event.findById(eventId)
      .populate("importedBy", "name email");

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async importEvent(eventId, userId, notes = "") {

    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    event.status = "imported";
    event.importedAt = new Date();
    event.importedBy = userId;
    event.importNotes = notes;

    await event.save();

    await ImportLog.create({
      event: eventId,
      importedBy: userId,
      notes
    });

    return event;
  }

}

export default new EventService();
