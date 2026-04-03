const RideServices = require("../services/ride.service");
const Utils = require("../utils/utils");
const constant = require("../utils/constant");

const findingCaptainandAssignRide = async (req, res) => {
  try {
    const ride = await RideServices?.findingCaptainandAssignRideService(
      req.user,
      req.body,
    );
    Utils?.responseFormat(res, ride?.code, ride?.message, ride?.data);
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const changeRideStatus = async (req, res) => {
  try {
    const ride = await RideServices?.ChangeRideStatus(req.body);
    Utils?.responseFormat(res, ride?.code, ride?.message, ride?.data);
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const getPreviousRide = async (req, res) => {
  try {
    const rideResponse = await RideServices?.getPreviousRide(req.user);
    const rides = rideResponse?.data || [];
    const previousRide = [];
    const futureRide = [];
    for (let i = 0; i < rides.length; i++) {
      const item = rides[i];

      if (item?.status === "requested") {
        futureRide.push(item);
      } else {
        previousRide.push(item);
      }
    }
    Utils?.responseFormat(res, rideResponse?.code, rideResponse?.message, {
      futureRide: futureRide,
      previousRide: previousRide,
    });
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const findingPathAlternative = async (req, res) => {
  try {
    const response = await RideServices?.findingPath(req.query);
    return Utils?.responseFormat(
      res,
      response?.code,
      response?.message,
      response?.data,
    );
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

const calculatingPriceForDrive = async (req, res) => {
  try {
    const response = await RideServices?.calculatingPrice(req.body);
    Utils?.responseFormat(
      res,
      response?.code,
      response?.message,
      response?.data,
    );
  } catch (error) {
    Utils?.responseFormat(
      res,
      error?.code || constant?.ResponseCode?.INTERNAL_SERVER_ERROR,
      error?.message,
    );
  }
};

module.exports = {
  findingCaptainandAssignRide,
  changeRideStatus,
  getPreviousRide,
  findingPathAlternative,
  calculatingPriceForDrive,
};
