import express from "express";
import passport from "passport";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
    session: true
  }),

  authController.googleSuccess
);

router.get("/failure", authController.googleFailure);

router.get("/logout", authController.logout);

router.get("/me", (req, res) => {
   //console.log("Auth check - user:=======>", req?.user);

  if (req.isAuthenticated()) {

    return res.json({
      success: true,
      user: req.user
    });

  }

  return res.status(401).json({
    success: false,
    message: "Not authenticated"
  });

});


export default router;
