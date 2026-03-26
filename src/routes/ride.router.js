const express = require("express");
const RideRouter = express.Router();
const { userAuth } = require("../middlewares/authHandler");
const RiderController = require("../controlers/ride.controller");

RideRouter.get(
  "/findcaptain",
  userAuth,
  RiderController?.findingCaptainandAssignRide,
);
RideRouter.post(
  "/changeridestatus",
  userAuth,
  RiderController?.changeRideStatus,
);
RideRouter.get("/previousride", userAuth, RiderController?.getPreviousRide);
module.exports = RideRouter;
