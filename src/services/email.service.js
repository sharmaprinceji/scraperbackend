import EmailOptin from "../models/EmailOption.js";
import Event from "../models/Events.js";

class EmailService {

  async saveOptin(data) {

    const { email, consent, eventId } = data;

    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }


    const optin = await EmailOptin.create({
      email,
      consent,
      event: eventId
    });

    return {
      optin,
      redirectUrl: event.originalEventUrl
    };
  }

}

export default new EmailService();
