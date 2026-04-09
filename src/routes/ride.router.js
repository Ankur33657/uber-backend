const express = require("express");
const RideRouter = express.Router();
const { userAuth } = require("../middlewares/authHandler");
const { captainAuth, CaptainAuth } = require("../middlewares/captainAuth");
const RiderController = require("../controlers/ride.controller");

RideRouter.post(
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
RideRouter.get(
  "/findalternatepath",
  userAuth,
  RiderController?.findingPathAlternative,
);

RideRouter.post(
  "/calculatingprice",
  userAuth,
  RiderController?.calculatingPriceForDrive,
);

RideRouter.get(
  "/getweeklyrecord",
  CaptainAuth,
  RiderController?.getCaptainWeeklyRecord,
);

module.exports = RideRouter;
