import emailService from "../services/email.service.js";

class EmailOptinController {

  async createOptin(req, res, next) {
    try {

      const { email, consent, eventId } = req.body;

      if (!email || consent === undefined || !eventId) {
        return res.status(400).json({
          success: false,
          message: "email, consent, and eventId are required"
        });
      }

      const result = await emailService.saveOptin({
        email,
        consent,
        eventId
      });

      res.status(201).json({
        success: true,
        message: "Email opt-in saved",
        redirectUrl: result.redirectUrl
      });

    } catch (error) {
      next(error);
    }
  }

}

export default new EmailOptinController();
