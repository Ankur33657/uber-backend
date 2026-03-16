const express = require("express");
const CaptainRouter = express.Router();
const CaptainControler = require("../controlers/captain.controller")
const {userAuth}=require("../middlewares/authHandler")
const {CaptainAuth} = require("../middlewares/captainAuth")


CaptainRouter.get("/login", CaptainControler?.loginCaptain);
CaptainRouter.post("/signup", userAuth, CaptainControler?.signUpCaptain);
CaptainRouter.get("/profile", CaptainAuth, CaptainControler?.getProfile);
CaptainRouter.patch("/profile/edit", CaptainAuth, CaptainControler?.updateProfile);

module.exports = CaptainRouter;