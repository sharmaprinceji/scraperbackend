import express from "express";
import emailOptinController from "../controllers/emailOptin.controller.js";
import validateRequired from "../middlewares/validate.middleware.js";

const router = express.Router();

// POST email opt-in
router.post("/", emailOptinController.createOptin);



router.post(
    "/",
    validateRequired(["email", "consent", "eventId"]),
    emailOptinController.createOptin
);


export default router;
