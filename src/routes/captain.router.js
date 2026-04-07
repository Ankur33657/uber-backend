const express = require("express");
const CaptainRouter = express.Router();
const CaptainControler = require("../controlers/captain.controller")
const {userAuth}=require("../middlewares/authHandler")
const {CaptainAuth} = require("../middlewares/captainAuth")


CaptainRouter.post("/login", CaptainControler?.loginCaptain);
CaptainRouter.post("/signup", CaptainControler?.signUpCaptain);
CaptainRouter.get("/profile", CaptainAuth, CaptainControler?.getProfile);
CaptainRouter.patch("/profile/edit", CaptainAuth, CaptainControler?.updateProfile);
CaptainRouter.delete(
  "/profile/delete",
  CaptainAuth,
  CaptainControler?.deleteCaptain,
);

module.exports = CaptainRouter;